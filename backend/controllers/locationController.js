const fetch = require('node-fetch');

// Endpoint to get user's location by IP
exports.getLocationByIP = async (req, res) => {
    try {
        // Use request IP (can be forwarded by proxy)
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Call the IP Geolocation API
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await response.json();

        // If the API returns an error
        if (response.status !== 200) {
            return res.status(500).send({ error: 'Failed to fetch location data.' });
        }

        // Send back the location details
        res.send({
            country: locationData.country_name,
            state: locationData.region,
            city: locationData.city,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
        });
    } catch (err) {
        console.error('Error fetching location by IP:', err);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

