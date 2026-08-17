import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4004', 10),
  db: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/collab_db',
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key-for-dev'
};
