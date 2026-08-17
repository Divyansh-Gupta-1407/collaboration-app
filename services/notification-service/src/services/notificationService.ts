import { pool } from '../db';
import { v4 as uuidv4 } from 'uuid';

export const createNotification = async (recipientId: string, senderId: string, type: string, title: string, body: string, resourceType: string, resourceId: string) => {
  const query = `
    INSERT INTO notifications (id, recipient_id, sender_id, type, title, body, resource_type, resource_id, is_read, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, NOW())
    RETURNING *;
  `;
  const values = [uuidv4(), recipientId, senderId, type, title, body, resourceType, resourceId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getNotifications = async (userId: string, page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;
  const query = `
    SELECT * FROM notifications
    WHERE recipient_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const result = await pool.query(query, [userId, limit, offset]);
  return result.rows;
};

export const markAsRead = async (notificationId: string, userId: string) => {
  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1 AND recipient_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [notificationId, userId]);
  return result.rows[0];
};

export const markAllAsRead = async (userId: string) => {
  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE recipient_id = $1 AND is_read = false;
  `;
  await pool.query(query, [userId]);
};

export const getUnreadCount = async (userId: string) => {
  const query = `
    SELECT COUNT(*) FROM notifications
    WHERE recipient_id = $1 AND is_read = false;
  `;
  const result = await pool.query(query, [userId]);
  return parseInt(result.rows[0].count, 10);
};
