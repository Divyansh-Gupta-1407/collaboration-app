import { createNotification } from './notificationService';
import { sendEmail } from './emailService';
import { pool } from '../db';

export const handleDocumentEvent = async (event: any) => {
  const { type, payload } = event;
  
  if (type === 'document.updated') {
    // Notify workspace members (simplified: assume a query to get workspace members)
    const membersQuery = `SELECT user_id FROM workspace_members WHERE workspace_id = $1 AND user_id != $2`;
    const members = await pool.query(membersQuery, [payload.workspaceId, payload.updatedBy]);
    
    for (const member of members.rows) {
      await createNotification(
        member.user_id,
        payload.updatedBy,
        'document_updated',
        'Document Updated',
        `Document "${payload.title}" was updated.`,
        'document',
        payload.id
      );
    }
  } else if (type === 'document.created') {
    const membersQuery = `SELECT user_id FROM workspace_members WHERE workspace_id = $1 AND user_id != $2`;
    const members = await pool.query(membersQuery, [payload.workspaceId, payload.createdBy]);
    
    for (const member of members.rows) {
      await createNotification(
        member.user_id,
        payload.createdBy,
        'document_created',
        'New Document',
        `A new document "${payload.title}" was created in your workspace.`,
        'document',
        payload.id
      );
    }
  }
};

export const handleCommentEvent = async (event: any) => {
  const { type, payload } = event;
  
  if (type === 'comment.created') {
    // Notify document creator or collaborators (simplified)
    const docQuery = `SELECT created_by FROM documents WHERE id = $1`;
    const docResult = await pool.query(docQuery, [payload.documentId]);
    
    if (docResult.rows.length > 0 && docResult.rows[0].created_by !== payload.createdBy) {
      await createNotification(
        docResult.rows[0].created_by,
        payload.createdBy,
        'comment_created',
        'New Comment',
        `Someone commented on your document.`,
        'comment',
        payload.id
      );
    }
  } else if (type === 'user.mentioned') {
    await createNotification(
      payload.mentionedUserId,
      payload.createdBy,
      'user_mentioned',
      'You were mentioned',
      `You were mentioned in a comment.`,
      'comment',
      payload.commentId
    );
    // Send email notification for mention
    const userQuery = `SELECT email FROM users WHERE id = $1`;
    const userResult = await pool.query(userQuery, [payload.mentionedUserId]);
    if (userResult.rows.length > 0) {
      await sendEmail(userResult.rows[0].email, 'You were mentioned!', '<p>You were mentioned in a comment.</p>');
    }
  }
};

export const handleWorkspaceEvent = async (event: any) => {
  const { type, payload } = event;
  
  if (type === 'workspace.member_added') {
    await createNotification(
      payload.userId,
      payload.addedBy,
      'workspace_joined',
      'Added to Workspace',
      `You were added to a new workspace.`,
      'workspace',
      payload.workspaceId
    );
  }
};
