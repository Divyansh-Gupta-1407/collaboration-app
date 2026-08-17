import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { verifyToken } from './auth';
import { DocumentManager } from './collaboration/DocumentManager';
import { PresenceManager } from './collaboration/PresenceManager';
import { createCollaborationRouter } from './routes/collaboration';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const presenceManager = new PresenceManager();
const documentManager = new DocumentManager(presenceManager);

app.use('/api/collaboration', createCollaborationRouter(presenceManager));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'collaboration-service' });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');
  const documentId = url.searchParams.get('documentId');

  if (!token || !documentId) {
    ws.close(1008, 'Token and documentId are required');
    return;
  }

  let user;
  try {
    user = verifyToken(token);
  } catch (err) {
    ws.close(1008, 'Invalid token');
    return;
  }

  // Use binary type for Yjs
  ws.binaryType = 'arraybuffer';

  documentManager.handleConnection(ws, documentId, user.userId, user.email);

  ws.on('message', (message: ArrayBuffer | Buffer) => {
    // ws library might give a Buffer or ArrayBuffer. Convert to Uint8Array.
    const uint8Msg = new Uint8Array(message as ArrayBuffer);
    documentManager.handleMessage(ws, documentId, uint8Msg);
  });

  ws.on('close', () => {
    documentManager.handleDisconnect(ws, documentId, user.userId);
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket error', err);
    documentManager.handleDisconnect(ws, documentId, user.userId);
  });
});

server.listen(config.port, () => {
  console.log(`Collaboration service running on port ${config.port}`);
});
