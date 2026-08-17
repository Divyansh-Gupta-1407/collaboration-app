import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { connectKafka } from './kafka';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

import workspaceRouter from './routes/workspaces';
import documentRouter from './routes/documents';
import commentRouter from './routes/comments';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/workspaces', authenticate, workspaceRouter);
app.use('/api/documents', authenticate, documentRouter);
app.use('/api/documents', authenticate, commentRouter);

app.use(errorHandler);

const startServer = async () => {
  await connectKafka();
  
  app.listen(config.port, () => {
    console.log(`Document Service running on port ${config.port}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
