import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { WebSocket } from 'ws';
import { PresenceManager } from './PresenceManager';

const messageSync = 0;
const messageAwareness = 1;

interface DocumentState {
  yDoc: Y.Doc;
  connections: Set<WebSocket>;
  awareness: awarenessProtocol.Awareness;
}

export class DocumentManager {
  private docs: Map<string, DocumentState> = new Map();
  private presenceManager: PresenceManager;

  constructor(presenceManager: PresenceManager) {
    this.presenceManager = presenceManager;
  }

  private getOrCreateDoc(documentId: string): DocumentState {
    if (this.docs.has(documentId)) {
      return this.docs.get(documentId)!;
    }

    const yDoc = new Y.Doc();
    const awareness = new awarenessProtocol.Awareness(yDoc);

    // Whenever awareness updates, broadcast to all connections
    awareness.on('update', ({ added, updated, removed }: { added: any, updated: any, removed: any }) => {
      const changedClients = added.concat(updated, removed);
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients));
      const buff = encoding.toUint8Array(encoder);
      
      const state = this.docs.get(documentId);
      if (state) {
        state.connections.forEach(conn => {
          if (conn.readyState === WebSocket.OPEN) {
            conn.send(buff);
          }
        });
      }
    });

    // Handle sync step 2 and updates
    yDoc.on('update', (update: Uint8Array) => {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.writeUpdate(encoder, update);
      const buff = encoding.toUint8Array(encoder);

      const state = this.docs.get(documentId);
      if (state) {
        state.connections.forEach(conn => {
          if (conn.readyState === WebSocket.OPEN) {
            conn.send(buff);
          }
        });
      }
    });

    const state = { yDoc, connections: new Set<WebSocket>(), awareness };
    this.docs.set(documentId, state);
    return state;
  }

  public handleConnection(ws: WebSocket, documentId: string, userId: string, userName?: string): void {
    const docState = this.getOrCreateDoc(documentId);
    docState.connections.add(ws);

    // Track presence
    this.presenceManager.addUser(documentId, userId, userName);

    // Send initial sync step 1
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, docState.yDoc);
    ws.send(encoding.toUint8Array(encoder));

    // Send initial awareness state
    const awarenessStates = docState.awareness.getStates();
    if (awarenessStates.size > 0) {
      const awarenessEncoder = encoding.createEncoder();
      encoding.writeVarUint(awarenessEncoder, messageAwareness);
      encoding.writeVarUint8Array(
        awarenessEncoder,
        awarenessProtocol.encodeAwarenessUpdate(docState.awareness, Array.from(awarenessStates.keys()))
      );
      ws.send(encoding.toUint8Array(awarenessEncoder));
    }
  }

  public handleMessage(ws: WebSocket, documentId: string, message: Uint8Array): void {
    const docState = this.docs.get(documentId);
    if (!docState) return;

    try {
      const encoder = encoding.createEncoder();
      const decoder = decoding.createDecoder(message);
      const messageType = decoding.readVarUint(decoder);

      if (messageType === messageSync) {
        encoding.writeVarUint(encoder, messageSync);
        const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, docState.yDoc, ws);
        if (syncMessageType === syncProtocol.messageYjsSyncStep2 && !ws.OPEN) {
           return;
        }
        if (syncMessageType === syncProtocol.messageYjsSyncStep1) {
           ws.send(encoding.toUint8Array(encoder));
        }
      } else if (messageType === messageAwareness) {
        const update = decoding.readVarUint8Array(decoder);
        awarenessProtocol.applyAwarenessUpdate(docState.awareness, update, ws);
      }
    } catch (e) {
      console.error('Error handling message', e);
    }
  }

  public handleDisconnect(ws: WebSocket, documentId: string, userId: string): void {
    const docState = this.docs.get(documentId);
    if (docState) {
      docState.connections.delete(ws);
      this.presenceManager.removeUser(documentId, userId);
      
      // We could persist and remove from memory if connections === 0
      if (docState.connections.size === 0) {
        // Here we could persist to Redis/DB
        this.docs.delete(documentId);
      }
    }
  }
}
