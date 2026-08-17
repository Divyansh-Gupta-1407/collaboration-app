import { pool } from '../db';

export const checkPermission = async (documentId: string, userId: string): Promise<string | null> => {
  // Check direct doc permission
  const directPerm = await pool.query(
    'SELECT role FROM document_permissions WHERE document_id = $1 AND user_id = $2',
    [documentId, userId]
  );
  if (directPerm.rows.length) return directPerm.rows[0].role;

  // Check workspace membership
  const wsPerm = await pool.query(
    `SELECT wm.role 
     FROM workspace_members wm 
     JOIN documents d ON wm.workspace_id = d.workspace_id 
     WHERE d.id = $1 AND wm.user_id = $2`,
    [documentId, userId]
  );
  if (wsPerm.rows.length) return wsPerm.rows[0].role;

  return null;
};

export const grantPermission = async (documentId: string, granterId: string, targetUserId: string, role: string) => {
  const granterRole = await checkPermission(documentId, granterId);
  if (granterRole !== 'owner') throw new Error('Forbidden');

  await pool.query(
    'INSERT INTO document_permissions (document_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (document_id, user_id) DO UPDATE SET role = $3',
    [documentId, targetUserId, role]
  );
};

export const revokePermission = async (documentId: string, granterId: string, targetUserId: string) => {
  const granterRole = await checkPermission(documentId, granterId);
  if (granterRole !== 'owner') throw new Error('Forbidden');

  await pool.query(
    'DELETE FROM document_permissions WHERE document_id = $1 AND user_id = $2',
    [documentId, targetUserId]
  );
};

export const getPermissions = async (documentId: string) => {
  const result = await pool.query('SELECT * FROM document_permissions WHERE document_id = $1', [documentId]);
  return result.rows;
};
