import { Redis } from 'ioredis';
import { config } from './config';

export const redisPublisher = new Redis(config.redis);
export const redisSubscriber = new Redis(config.redis);
export const redisClient = new Redis(config.redis); // general client

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisPublisher.on('error', (err) => console.error('Redis Publisher Error', err));
redisSubscriber.on('error', (err) => console.error('Redis Subscriber Error', err));
