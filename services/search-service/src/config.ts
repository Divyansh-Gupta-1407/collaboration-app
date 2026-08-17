import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4005', 10),
  db: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/collab_db',
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  },
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key-for-dev'
};
