import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 4001,
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
  POSTGRES_DB: process.env.POSTGRES_DB || 'collab_users',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtkey',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  KAFKA_BROKER: process.env.KAFKA_BROKER || 'localhost:9092'
};
