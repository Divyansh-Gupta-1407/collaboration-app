import jwt from 'jsonwebtoken';
import { config } from './config';

export interface AuthUser {
  userId: string;
  email: string;
}

export function verifyToken(token: string): AuthUser {
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    return {
      userId: decoded.userId || decoded.id,
      email: decoded.email,
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
}
