import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as commentService from '../services/commentService';

const router = Router({ mergeParams: true });

router.post('/:documentId/comments', async (req: AuthRequest, res, next) => {
  try {
    const data = await commentService.createComment(req.userId!, { documentId: req.params.documentId, ...req.body });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/:documentId/comments', async (req: AuthRequest, res, next) => {
  try {
    const data = await commentService.getComments(req.params.documentId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.put('/comments/:commentId/resolve', async (req: AuthRequest, res, next) => {
  try {
    const data = await commentService.resolveComment(req.params.commentId, req.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete('/comments/:commentId', async (req: AuthRequest, res, next) => {
  try {
    await commentService.deleteComment(req.params.commentId, req.userId!);
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

export default router;
