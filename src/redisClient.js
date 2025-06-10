require('dotenv').config();
const { Redis } = require('@upstash/redis');

if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
	console.error('Missing required environment variables: UPSTASH_REDIS_URL and/or UPSTASH_REDIS_TOKEN');
	console.error('Please set these in your Secrets or .env file');
	process.exit(1);
}

const redisClient = new Redis({
	url: process.env.UPSTASH_REDIS_URL,
	token: process.env.UPSTASH_REDIS_TOKEN,
});
module.exports = redisClient;
