import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as workspaceService from '../services/workspaceService';

const router = Router();

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = await workspaceService.createWorkspace(req.userId!, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const data = await workspaceService.getWorkspacesForUser(req.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = await workspaceService.getWorkspaceById(req.params.id, req.userId!);
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = await workspaceService.updateWorkspace(req.params.id, req.userId!, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/:id/members', async (req: AuthRequest, res, next) => {
  try {
    await workspaceService.addMember(req.params.id, req.userId!, req.body.targetUserId, req.body.role);
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

router.delete('/:id/members/:targetUserId', async (req: AuthRequest, res, next) => {
  try {
    await workspaceService.removeMember(req.params.id, req.userId!, req.params.targetUserId);
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

router.get('/:id/members', async (req: AuthRequest, res, next) => {
  try {
    const data = await workspaceService.getMembers(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;
