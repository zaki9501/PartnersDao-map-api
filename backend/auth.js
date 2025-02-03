const express = require("express");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const axios = require("axios");
const crypto = require("crypto");
const { Buffer } = require("buffer");
const router = express.Router();

// 1. PKCE Generation with Base64URL Encoding
const generatePKCE = () => {
  const codeVerifier = crypto.randomBytes(64)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return { codeVerifier, codeChallenge };
};

// 2. Enhanced OAuth2 Strategy Configuration
passport.use(
  "twitter-oauth2",
  new OAuth2Strategy(
    {
      authorizationURL: "https://twitter.com/i/oauth2/authorize",
      tokenURL: "https://api.twitter.com/2/oauth2/token",
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      state: true,
      pkce: true,
      passReqToCallback: true,
      scope: ["tweet.read", "users.read", "offline.access"],
      authorizationParams: {
        code_challenge_method: "S256",
      },
    },
    async (req, accessToken, refreshToken, params, profile, done) => {
      try {
        // Verify state matches session
        if (req.query.state !== req.session.oauthState) {
          throw new Error("State parameter mismatch");
        }

        // Fetch user details
        const userData = await axios.get("https://api.twitter.com/2/users/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const user = {
          id: userData.data.data.id,
          username: userData.data.data.username,
          name: userData.data.data.name,
          profileImage: userData.data.data.profile_image_url,
          accessToken,
          refreshToken,
        };

        // Store user in Redis with TTL
        await req.redisClient.setEx(
          `user:${user.id}`,
          3600, // 1 hour expiration
          JSON.stringify(user)
        );

        return done(null, user);
      } catch (error) {
        console.error("Authentication error:", error.response?.data || error);
        return done(error);
      }
    }
  )
);

// 3. Session Serialization with Redis
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const userData = await req.redisClient.get(`user:${id}`);
    done(null, JSON.parse(userData));
  } catch (error) {
    done(error);
  }
});

// 4. Authentication Routes
router.get("/x", (req, res, next) => {
  req.session.regenerate(async (err) => {
    if (err) return next(err);

    const { codeVerifier, codeChallenge } = generatePKCE();
    const state = crypto.randomBytes(32).toString("hex");

    req.session.codeVerifier = codeVerifier;
    req.session.oauthState = state;

    try {
      await new Promise((resolve, reject) => 
        req.session.save(err => err ? reject(err) : resolve())
      );

      const authURL = new URL("https://twitter.com/i/oauth2/authorize");
      authURL.searchParams.append("response_type", "code");
      authURL.searchParams.append("client_id", process.env.TWITTER_CLIENT_ID);
      authURL.searchParams.append("redirect_uri", process.env.TWITTER_CALLBACK_URL);
      authURL.searchParams.append("scope", "tweet.read users.read offline.access");
      authURL.searchParams.append("state", state);
      authURL.searchParams.append("code_challenge", codeChallenge);
      authURL.searchParams.append("code_challenge_method", "S256");

      res.redirect(authURL.toString());
    } catch (error) {
      next(error);
    }
  });
});

router.get("/x/callback", 
  (req, res, next) => {
    passport.authenticate("twitter-oauth2", 
      {
        failureRedirect: "/auth/x/failure",
        session: true
      },
      async (err, user) => {
        try {
          if (err || !user) {
            console.error("Authentication failed:", err?.message);
            return res.redirect("/auth/x/failure");
          }

          req.logIn(user, async (loginErr) => {
            if (loginErr) return next(loginErr);

            // Update session with fresh data
            req.session.userId = user.id;
            req.session.cookie.expires = new Date(Date.now() + 3600000); // 1 hour
            
            await new Promise((resolve, reject) =>
              req.session.save(err => err ? reject(err) : resolve())
            );

            res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
          });
        } catch (error) {
          next(error);
        }
      }
    )(req, res, next);
  }
);

// 5. User Data Endpoints
router.get("/user", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    
    const userData = await req.redisClient.get(`user:${req.user.id}`);
    if (!userData) return res.status(404).json({ error: "User not found" });

    res.json(JSON.parse(userData));
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/x/failure", (req, res) => {
  res.status(401).json({ 
    error: "Authentication failed",
    details: req.query.error || "Unknown error"
  });
});

// 6. Health Check Endpoint
router.get("/health", async (req, res) => {
  try {
    await req.redisClient.set("healthcheck", Date.now());
    const ping = await req.redisClient.get("healthcheck");
    
    res.json({
      status: "ok",
      redis: ping ? "connected" : "disconnected",
      session: req.sessionID,
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Error Handling Middleware
router.use((err, req, res, next) => {
  console.error("Auth Error:", err);
  res.status(500).json({
    error: "Authentication process failed",
    details: process.env.NODE_ENV === "development" ? err.message : null
  });
});

module.exports = router;
