import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../services/notificationService';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const notifications = await getNotifications(req.user!.id, page, limit);
    res.json({ success: true, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
});

router.get('/unread-count', async (req: AuthRequest, res: Response) => {
  try {
    const count = await getUnreadCount(req.user!.id);
    res.json({ success: true, data: { count } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
});

router.put('/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const notification = await markAsRead(req.params.id, req.user!.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
    }
    res.json({ success: true, data: notification });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
});

router.put('/read-all', async (req: AuthRequest, res: Response) => {
  try {
    await markAllAsRead(req.user!.id);
    res.json({ success: true, data: null });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
});

export default router;
