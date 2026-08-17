import { Kafka, EachMessagePayload } from 'kafkajs';
import { config } from './config';
import { indexDocument, removeDocument } from './elasticsearch';

const kafka = new Kafka({
  clientId: 'search-service',
  brokers: config.kafka.brokers,
});

const consumer = kafka.consumer({ groupId: 'search-service' });

export const startKafkaConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Kafka Consumer connected');

    await consumer.subscribe({ topic: 'document-events', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        if (!message.value) return;
        try {
          const event = JSON.parse(message.value.toString());
          console.log(`Received event on topic ${topic}:`, event);
          
          if (topic === 'document-events') {
            if (event.type === 'document.created' || event.type === 'document.updated') {
              // Convert payload to expected document format
              const doc = {
                id: event.payload.id,
                title: event.payload.title,
                content_text: event.payload.content || '',
                workspace_id: event.payload.workspaceId,
                created_by: event.payload.createdBy || event.payload.updatedBy,
                created_at: new Date(),
                updated_at: new Date(),
              };
              await indexDocument(doc);
            } else if (event.type === 'document.deleted') {
              await removeDocument(event.payload.id);
            }
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
