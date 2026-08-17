import { Router, Request, Response } from 'express';
import { PresenceManager } from '../collaboration/PresenceManager';

export function createCollaborationRouter(presenceManager: PresenceManager) {
  const router = Router();

  router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'collaboration-service' });
  });

  router.get('/documents/:id/presence', (req: Request, res: Response) => {
    const documentId = req.params.id;
    const presence = presenceManager.getPresence(documentId);
    res.status(200).json({
      success: true,
      data: presence
    });
  });

  return router;
}
