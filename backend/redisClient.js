const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Error:', err);
});

redisClient.on('connect', () => {
    console.log('✅ Connected to Redis');
});

// Ensure Redis is always connected
(async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect().catch(err => {
            console.error('❌ Redis Connection Error:', err);
        });
    }
})();

module.exports = redisClient;

