import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { publishEvent } from '../kafka';
import { checkPermission } from './permissionService';

export const createDocument = async (userId: string, dto: { workspaceId: string, title: string, content: string }) => {
  const documentId = uuidv4();
  const versionId = uuidv4();
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const docResult = await client.query(
      'INSERT INTO documents (id, workspace_id, title, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [documentId, dto.workspaceId, dto.title, userId]
    );
    
    await client.query(
      'INSERT INTO document_versions (id, document_id, version_number, content, created_by) VALUES ($1, $2, $3, $4, $5)',
      [versionId, documentId, 1, dto.content, userId]
    );
    await client.query('COMMIT');
    
    await publishEvent('document.created', { documentId, workspaceId: dto.workspaceId, title: dto.title, userId });
    
    return docResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const getDocument = async (documentId: string, userId: string) => {
  const role = await checkPermission(documentId, userId);
  if (!role) throw new Error('Forbidden');

  const result = await pool.query(
    `SELECT d.*, v.content, v.version_number 
     FROM documents d
     LEFT JOIN document_versions v ON d.id = v.document_id
     WHERE d.id = $1 AND d.archived = false
     ORDER BY v.version_number DESC LIMIT 1`,
    [documentId]
  );
  return result.rows[0];
};

export const getDocumentsByWorkspace = async (workspaceId: string, userId: string) => {
  const memberCheck = await pool.query(
    'SELECT 1 FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
    [workspaceId, userId]
  );
  if (!memberCheck.rows.length) throw new Error('Forbidden');

  const result = await pool.query(
    'SELECT * FROM documents WHERE workspace_id = $1 AND archived = false',
    [workspaceId]
  );
  return result.rows;
};

export const updateDocument = async (documentId: string, userId: string, dto: { title?: string, content: string }) => {
  const role = await checkPermission(documentId, userId);
  if (role !== 'editor' && role !== 'owner') throw new Error('Forbidden');

  const versionId = uuidv4();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    let doc;
    if (dto.title) {
      const res = await client.query('UPDATE documents SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [dto.title, documentId]);
      doc = res.rows[0];
    } else {
      const res = await client.query('UPDATE documents SET updated_at = NOW() WHERE id = $1 RETURNING *', [documentId]);
      doc = res.rows[0];
    }

    const maxVerRes = await client.query('SELECT COALESCE(MAX(version_number), 0) as max_v FROM document_versions WHERE document_id = $1', [documentId]);
    const nextVersion = parseInt(maxVerRes.rows[0].max_v) + 1;

    await client.query(
      'INSERT INTO document_versions (id, document_id, version_number, content, created_by) VALUES ($1, $2, $3, $4, $5)',
      [versionId, documentId, nextVersion, dto.content, userId]
    );

    await client.query('COMMIT');
    await publishEvent('document.updated', { documentId, userId, version: nextVersion });
    
    return { ...doc, content: dto.content, version: nextVersion };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const archiveDocument = async (documentId: string, userId: string) => {
  const role = await checkPermission(documentId, userId);
  if (role !== 'owner') throw new Error('Forbidden');

  await pool.query('UPDATE documents SET archived = true WHERE id = $1', [documentId]);
  await publishEvent('document.archived', { documentId, userId });
};

export const getVersions = async (documentId: string) => {
  const result = await pool.query('SELECT * FROM document_versions WHERE document_id = $1 ORDER BY version_number DESC', [documentId]);
  return result.rows;
};

export const restoreVersion = async (documentId: string, versionId: string, userId: string) => {
  const role = await checkPermission(documentId, userId);
  if (role !== 'editor' && role !== 'owner') throw new Error('Forbidden');

  const versionRes = await pool.query('SELECT content FROM document_versions WHERE id = $1 AND document_id = $2', [versionId, documentId]);
  if (!versionRes.rows.length) throw new Error('Version not found');
  
  return updateDocument(documentId, userId, { content: versionRes.rows[0].content });
};
