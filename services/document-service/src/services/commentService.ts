import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { publishEvent } from '../kafka';
import { checkPermission } from './permissionService';

export const createComment = async (userId: string, dto: { documentId: string, content: string, parentId?: string }) => {
  const role = await checkPermission(dto.documentId, userId);
  if (!role) throw new Error('Forbidden');

  const commentId = uuidv4();
  const result = await pool.query(
    'INSERT INTO comments (id, document_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [commentId, dto.documentId, userId, dto.content, dto.parentId || null]
  );

  const mentions = dto.content.match(/@\w+/g) || [];
  if (mentions.length > 0) {
    await publishEvent('comment.mentions', { commentId, documentId: dto.documentId, mentions, userId });
  }

  await publishEvent('comment.created', { commentId, documentId: dto.documentId, userId });

  return result.rows[0];
};

export const getComments = async (documentId: string) => {
  const result = await pool.query('SELECT * FROM comments WHERE document_id = $1 ORDER BY created_at ASC', [documentId]);
  return result.rows;
};

export const resolveComment = async (commentId: string, userId: string) => {
  const commentRes = await pool.query('SELECT document_id FROM comments WHERE id = $1', [commentId]);
  if (!commentRes.rows.length) throw new Error('Not found');
  
  const role = await checkPermission(commentRes.rows[0].document_id, userId);
  if (role !== 'editor' && role !== 'owner') throw new Error('Forbidden');

  const result = await pool.query('UPDATE comments SET resolved = true WHERE id = $1 RETURNING *', [commentId]);
  return result.rows[0];
};

export const deleteComment = async (commentId: string, userId: string) => {
  const commentRes = await pool.query('SELECT user_id, document_id FROM comments WHERE id = $1', [commentId]);
  if (!commentRes.rows.length) throw new Error('Not found');

  if (commentRes.rows[0].user_id !== userId) {
    const role = await checkPermission(commentRes.rows[0].document_id, userId);
    if (role !== 'owner') throw new Error('Forbidden');
  }

  await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
};
