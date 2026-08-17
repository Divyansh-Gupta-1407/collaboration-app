import { Kafka, Producer } from 'kafkajs';
import { config } from './config';

const kafka = new Kafka({
  clientId: 'document-service',
  brokers: [config.kafkaBroker]
});

const producer: Producer = kafka.producer();

export const connectKafka = async () => {
  try {
    await producer.connect();
    console.log('Connected to Kafka successfully');
  } catch (error) {
    console.error('Failed to connect to Kafka:', error);
  }
};

export const publishEvent = async (topic: string, event: any) => {
  try {
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(event) }
      ]
    });
  } catch (error) {
    console.error(`Failed to publish event to topic ${topic}:`, error);
  }
};
