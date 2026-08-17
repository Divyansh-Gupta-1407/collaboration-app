import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { publishEvent } from '../kafka';

export const createWorkspace = async (ownerId: string, dto: { name: string, description?: string }) => {
  const workspaceId = uuidv4();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'INSERT INTO workspaces (id, name, description) VALUES ($1, $2, $3)',
      [workspaceId, dto.name, dto.description || null]
    );
    await client.query(
      'INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3)',
      [workspaceId, ownerId, 'owner']
    );
    await client.query('COMMIT');
    
    await publishEvent('workspace.member_added', { workspaceId, userId: ownerId, role: 'owner' });
    
    return { id: workspaceId, name: dto.name, description: dto.description };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const getWorkspacesForUser = async (userId: string) => {
  const result = await pool.query(
    `SELECT w.* FROM workspaces w
     JOIN workspace_members wm ON w.id = wm.workspace_id
     WHERE wm.user_id = $1`,
    [userId]
  );
  return result.rows;
};

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
  const result = await pool.query(
    `SELECT w.* FROM workspaces w
     JOIN workspace_members wm ON w.id = wm.workspace_id
     WHERE w.id = $1 AND wm.user_id = $2`,
    [workspaceId, userId]
  );
  return result.rows[0];
};

export const updateWorkspace = async (workspaceId: string, userId: string, dto: { name: string, description?: string }) => {
  const memberCheck = await pool.query(
    'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
    [workspaceId, userId]
  );
  if (!memberCheck.rows.length || (memberCheck.rows[0].role !== 'owner' && memberCheck.rows[0].role !== 'admin')) {
    throw new Error('Forbidden');
  }

  const result = await pool.query(
    'UPDATE workspaces SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
    [dto.name, dto.description, workspaceId]
  );
  return result.rows[0];
};

export const addMember = async (workspaceId: string, userId: string, targetUserId: string, role: string) => {
  const memberCheck = await pool.query(
    'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
    [workspaceId, userId]
  );
  if (!memberCheck.rows.length || (memberCheck.rows[0].role !== 'owner' && memberCheck.rows[0].role !== 'admin')) {
    throw new Error('Forbidden');
  }

  await pool.query(
    'INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = $3',
    [workspaceId, targetUserId, role]
  );

  await publishEvent('workspace.member_added', { workspaceId, userId: targetUserId, role });
};

export const removeMember = async (workspaceId: string, userId: string, targetUserId: string) => {
  const memberCheck = await pool.query(
    'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
    [workspaceId, userId]
  );
  if (!memberCheck.rows.length || (memberCheck.rows[0].role !== 'owner' && memberCheck.rows[0].role !== 'admin')) {
    throw new Error('Forbidden');
  }

  await pool.query(
    'DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
    [workspaceId, targetUserId]
  );
  
  await publishEvent('workspace.member_removed', { workspaceId, userId: targetUserId });
};

export const getMembers = async (workspaceId: string) => {
  const result = await pool.query(
    'SELECT * FROM workspace_members WHERE workspace_id = $1',
    [workspaceId]
  );
  return result.rows;
};
