const express = require('express');
const axios = require('axios');
const { Connection, PublicKey } = require('@solana/web3.js');

const router = express.Router();
const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";
const TOKEN_ADDRESS = "Your_Solana_Token_Address"; // ✅ Replace with your SPL Token address
const MINIMUM_BALANCE = 1;
let userLocations = []; // Temporary in-memory storage (Replace with DB in production)

// ✅ Route: Get User Location by IP
router.get('/get-location-by-ip', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(`Fetching location for IP: ${ip}`);

        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const { lat, lon, country, regionName: state } = response.data;

        if (!lat || !lon) {
            return res.status(400).json({ error: "Could not determine location." });
        }

        res.json({ latitude: lat, longitude: lon, country, state });
    } catch (error) {
        console.error("Error fetching IP location:", error);
        res.status(500).json({ error: "Failed to fetch location." });
    }
});

// ✅ Route: Get All Pinned Locations
router.get('/get-locations', (req, res) => {
    res.json(userLocations);
});

module.exports = router;
