const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = redis.createClient();

        this.client.on('error', (error) => {
            console.error(`Redis client error: ${error.message}`);
        });

        this.client.on('connect', () => {
            console.log('Redis client connected');
        });

        this.client.on('ready', () => {
            console.log('Redis client ready');
        });

        this.client.on('end', () => {
            console.log('Redis client connection ended');
        });
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        try {
            const value = await new Promise((resolve, reject) => {
                this.client.get(key, (err, reply) => {
                    if (err) reject(err);
                    else resolve(reply);
                });
            });
            return value;
        } catch (error) {
            console.error(`Error fetching value from Redis: ${error.message}`);
            return null;
        }
    }

    async set(key, value, duration) {
        try {
            this.client.set(key, value, 'EX', duration);
        } catch (error) {
            console.error(`Error setting value in Redis: ${error.message}`);
        }
    }

    async del(key) {
        try {
            this.client.del(key);
        } catch (error) {
            console.error(`Error deleting value from Redis: ${error.message}`);
        }
    }
}

const redisClient = new RedisClient();
module.exports = redisClient;
