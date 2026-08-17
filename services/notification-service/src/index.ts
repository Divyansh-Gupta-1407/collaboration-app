import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import notificationsRouter from './routes/notifications';
import { startKafkaConsumer } from './kafka';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/notifications', notificationsRouter);

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.listen(config.port, async () => {
  console.log(`Notification Service running on port ${config.port}`);
  await startKafkaConsumer();
});
