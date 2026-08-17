import { Kafka, EachMessagePayload } from 'kafkajs';
import { config } from './config';
import { handleDocumentEvent, handleCommentEvent, handleWorkspaceEvent } from './services/eventHandler';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: config.kafka.brokers,
});

const consumer = kafka.consumer({ groupId: 'notification-service' });

export const startKafkaConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Kafka Consumer connected');

    await consumer.subscribe({ topic: 'document-events', fromBeginning: false });
    await consumer.subscribe({ topic: 'comment-events', fromBeginning: false });
    await consumer.subscribe({ topic: 'workspace-events', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        if (!message.value) return;
        try {
          const event = JSON.parse(message.value.toString());
          console.log(`Received event on topic ${topic}:`, event);
          
          switch (topic) {
            case 'document-events':
              await handleDocumentEvent(event);
              break;
            case 'comment-events':
              await handleCommentEvent(event);
              break;
            case 'workspace-events':
              await handleWorkspaceEvent(event);
              break;
            default:
              console.log(`No handler for topic ${topic}`);
          }
        } catch (error) {
          console.error(`Error processing message from topic ${topic}:`, error);
        }
      },
    });
  } catch (error) {
    console.error('Failed to start Kafka consumer:', error);
  }
};
