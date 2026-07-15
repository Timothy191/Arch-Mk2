import { User, Session } from './types';
import { db } from '../database';

export async function getSessionUser(): Promise<{ user: User | null; shouldSignOut: boolean }> {
  try {
    // Get current user from session table
    const session = await db.query('SELECT * FROM sessions WHERE session_token = $1')
      .execute(process.env.SESSION_TOKEN);
      
    if (!session.exists) {
      return { user: null, shouldSignOut: true };
    }
    
    // Get user from employees table
    const user = await db.query('SELECT * FROM employees WHERE auth_id = $1')
      .execute(session.user_id);
      
    const shouldSignOut = false;
    return { user, shouldSignOut };
  } catch (error) {
    console.error('Auth error:', error);
    return { user: null, shouldSignOut: true };
  }
}

export async function getUserSafely(): Promise<User | null> {
  const { user } = await getSessionUser();
  return user;
}

export async function isAuthenticated(): Promise<boolean> {
  const { user } = await getSessionUser();
  return !!user;
}

export async function signIn(username: string, password: string): Promise<User | null> {
  // In a real implementation, this would verify against a users table
  // For now, we'll simulate with a test user
  if (username === 'test' && password === 'test') {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'operator',
      created_at: new Date().toISOString()
    };
  }
  return null;
}

export async function signOut(): Promise<void> {
  // In a real implementation, this would invalidate the session
  // For now, we'll just remove the session token
  // This would be handled by frontend removing the token
  return;
}

export async function signUp(fullName: string, role: string = 'operator'): Promise<User | null> {
  // In a real implementation, this would create a user record
  // For now, we'll simulate with a test user
  if (fullName) {
    return {
      id: 'user-' + Date.now(),
      full_name: fullName,
      role: role,
      created_at: new Date().toISOString()
    };
  }
  return null;
}