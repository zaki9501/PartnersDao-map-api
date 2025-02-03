const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { createClient } = require("redis");
const RedisStore = require("connect-redis").default; // ✅ Fix import for connect-redis v7+
require("dotenv").config();

const locationRoutes = require("./routes/locationRoutes");
const authRoutes = require("./auth");

const app = express();

// ✅ Trust Proxy for Correct Cookie Handling
app.set("trust proxy", 1);

// ✅ CORS Configuration
app.use(
    cors({
        origin: "http://95.164.18.230:3000",
        credentials: true,
    })
);

// ✅ Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Initialize Redis Client (Only Here)
const redisClient = createClient({
    socket: {
        host: "127.0.0.1",
        port: 6379,
    }
});

redisClient.on("error", (err) => console.error("❌ Redis Connection Error:", err));
redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.on("ready", () => console.log("✅ Redis Ready"));

(async () => {
    try {
        await redisClient.connect();
        console.log("✅ Redis Connection Established");
    } catch (err) {
        console.error("❌ Redis Connection Failed:", err);
    }
})();

// ✅ Redis Store for Sessions (Fixed for connect-redis@7+)
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "sess:",
    ttl: 86400, // 24-hour session expiry
});

// ✅ Use Redis for Express Sessions
app.use(
    session({
        store: redisStore,
        secret: process.env.SESSION_SECRET || "your-secure-random-session-secret",
        resave: false, // ✅ Don't resave unchanged sessions
        saveUninitialized: false, // ✅ Only store initialized sessions
        rolling: true, // ✅ Refresh session expiration on each request
        cookie: {
            secure: false, // ✅ Set to true if using HTTPS
            httpOnly: true, // ✅ Prevent JavaScript access to cookies
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000, // ✅ 1 day expiration
        },
    })
);

// ✅ Middleware to Log Session Data
app.use((req, res, next) => {
    console.log("🟢 Middleware Hit - Session ID:", req.sessionID);
    console.log("🟢 Current Session Data:", req.session);
    next();
});

// ✅ Attach Redis Client to `req`
app.use((req, res, next) => {
    req.redisClient = redisClient; // ✅ Pass Redis Client to `auth.js`
    next();
});

// ✅ Routes
app.use("/api/locations", locationRoutes);
app.use("/auth", authRoutes); // ✅ Auth routes will use `req.redisClient`

// ✅ Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Map API!");
});

// ✅ Handle 404 Errors for Undefined Routes
app.use((req, res) => {
    res.status(404).send({ error: "Route not found!" });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error stack:", err.stack);
    res.status(500).send({ error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
});
