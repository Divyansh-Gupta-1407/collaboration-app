import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import searchRouter from './routes/search';
import { startKafkaConsumer } from './kafka';
import { ensureIndex } from './elasticsearch';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/search', searchRouter);

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.listen(config.port, async () => {
  console.log(`Search Service running on port ${config.port}`);
  await ensureIndex();
  await startKafkaConsumer();
});
