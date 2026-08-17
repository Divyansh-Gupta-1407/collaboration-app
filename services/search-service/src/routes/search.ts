import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { search, indexDocument } from '../elasticsearch';
import { pool } from '../db';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const query = req.query.q as string;
    const workspaceId = req.query.workspaceId as string;
    const docType = req.query.docType as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query || !workspaceId) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Missing q or workspaceId' } });
    }

    const results = await search(query, workspaceId, docType, page, limit);
    res.json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
});

router.post('/reindex', async (req: AuthRequest, res: Response) => {
  try {
    // Note: In a real app, this should be admin-only or restricted.
    const query = `SELECT id, title, content, workspace_id, created_by, created_at, updated_at FROM documents`;
    const result = await pool.query(query);
    
    let indexedCount = 0;
    for (const row of result.rows) {
      await indexDocument({
        id: row.id,
        title: row.title,
        content_text: row.content, // Assuming content is text-like for now
        workspace_id: row.workspace_id,
        doc_type: 'document',
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at
      });
      indexedCount++;
    }
    
    res.json({ success: true, data: { message: `Reindexed ${indexedCount} documents` } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
  }
});

export default router;
