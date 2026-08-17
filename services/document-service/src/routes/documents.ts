import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as documentService from '../services/documentService';
import * as permissionService from '../services/permissionService';

const router = Router();

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = await documentService.createDocument(req.userId!, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/workspace/:workspaceId', async (req: AuthRequest, res, next) => {
  try {
    const data = await documentService.getDocumentsByWorkspace(req.params.workspaceId, req.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = await documentService.getDocument(req.params.id, req.userId!);
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = await documentService.updateDocument(req.params.id, req.userId!, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    await documentService.archiveDocument(req.params.id, req.userId!);
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

router.get('/:id/versions', async (req: AuthRequest, res, next) => {
  try {
    // Basic check inside service might be needed, here just pass through
    const data = await documentService.getVersions(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/:id/versions/:versionId/restore', async (req: AuthRequest, res, next) => {
  try {
    const data = await documentService.restoreVersion(req.params.id, req.params.versionId, req.userId!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/:id/permissions', async (req: AuthRequest, res, next) => {
  try {
    await permissionService.grantPermission(req.params.id, req.userId!, req.body.targetUserId, req.body.role);
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

router.delete('/:id/permissions/:targetUserId', async (req: AuthRequest, res, next) => {
  try {
    await permissionService.revokePermission(req.params.id, req.userId!, req.params.targetUserId);
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
});

router.get('/:id/permissions', async (req: AuthRequest, res, next) => {
  try {
    const data = await permissionService.getPermissions(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;
