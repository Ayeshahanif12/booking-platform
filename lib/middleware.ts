import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set in environment - authentication will fail');
}

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export async function verifyAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    if (!JWT_SECRET) throw new Error('Server misconfiguration: JWT_SECRET not set');
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function requireAuth(req: NextRequest): AuthUser {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    if (!JWT_SECRET) throw new Error('Server misconfiguration: JWT_SECRET not set');
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function requireRole(user: AuthUser, allowedRoles: string[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }
}
