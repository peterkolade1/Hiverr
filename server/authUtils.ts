import type { User } from "@shared/schema";

// Sanitized user type for API responses (excludes sensitive fields)
export type PublicUser = Omit<User, 'password'>;

// Convert User to PublicUser by removing sensitive fields
export function toPublicUser(user: User): PublicUser {
  const { password, ...publicUser } = user;
  return publicUser;
}

// Normalize email addresses to prevent case-variant duplicates
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Validate email format (additional validation beyond zod)
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to get current user from session data consistently
export async function getCurrentUser(sessionData: any, storage: any): Promise<User | null> {
  if (!sessionData) {
    return null;
  }

  let user;

  // Get user based on session type
  if (sessionData.type === 'oidc') {
    // OAuth user - get by externalId from claims
    const externalId = sessionData.claims?.sub;
    if (!externalId) {
      return null;
    }
    user = await storage.getUserByExternalId(externalId);
  } else if (sessionData.type === 'local') {
    // Custom user - get by userId
    const userId = sessionData.userId;
    if (!userId) {
      return null;
    }
    user = await storage.getUser(userId);
  } else {
    return null;
  }

  return user || null;
}