/**
 * Authentication utilities for M$A International Admin CMS
 * 
 * SECURITY: Credentials are stored server-side via environment variables
 * Client-side uses httpOnly-like session tokens (via cookie headers)
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ============================================
// Server-side Auth (API Routes only)
// ============================================

// Get admin credentials from environment variables (never hardcoded)
function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !passwordHash) {
    console.error('CRITICAL SECURITY ERROR: ADMIN_EMAIL or ADMIN_PASSWORD_HASH environment variables are not set.');
    // Throw error to prevent fallback to default passwords
    throw new Error('Admin credentials not properly configured on server.');
  }

  return { email, passwordHash };
}

// Hash password using scrypt with a random salt or provided salt
export function hashPassword(password: string, salt: string = crypto.randomBytes(16).toString('hex')): string {
  const hash = crypto.scryptSync(password, salt, 64); // 64 bytes key length
  return `${salt}:${hash.toString('hex')}`;
}

// Verify admin credentials
export function verifyCredentials(email: string, password: string): boolean {
  const admin = getAdminCredentials();
  const emailMatch = email.toLowerCase() === admin.email.toLowerCase();
  
  try {
    const parts = admin.passwordHash.split(':');
    if (parts.length !== 2) return false;
    const [salt, storedHashStr] = parts;
    
    // Hash input password with same salt
    const inputHash = crypto.scryptSync(password, salt, 64);
    const storedHash = Buffer.from(storedHashStr, 'hex');
    
    // Timing-safe comparison to prevent timing attacks
    const hashMatch = crypto.timingSafeEqual(inputHash, storedHash);
    return emailMatch && hashMatch;
  } catch {
    return false;
  }
}

// Generate a secure session token (stateless using HMAC)
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function createSession(email: string): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `${email}|${expiresAt}`;
  
  // Use ADMIN_PASSWORD_HASH as secret for HMAC
  const secret = process.env.ADMIN_PASSWORD_HASH || 'default_secret_for_dev';
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  
  return `${payload}|${signature}`;
}

export function validateSession(token: string): boolean {
  if (!token) return false;
  const parts = token.split('|');
  if (parts.length !== 3) return false;
  
  const [email, expiresAtStr, signature] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;
  
  const payload = `${email}|${expiresAt}`;
  const secret = process.env.ADMIN_PASSWORD_HASH || 'default_secret_for_dev';
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  
  return signature === expectedSignature;
}

export function destroySession(token: string): void {
  // Stateless token cannot be destroyed on the server.
  // The client must delete the cookie.
}

// Cookie name for session
export const SESSION_COOKIE_NAME = 'mna_session';

// ============================================
// Rate Limiter (in-memory, per-IP)
// ============================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export function checkRateLimit(
  ip: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 5 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = ip;
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    rateLimitStore.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

// Get client IP from request
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}

// ============================================
// Input Sanitization
// ============================================

// Sanitize string input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Sanitize object values (shallow)
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(sanitized[key] as string);
    }
  }
  return sanitized;
}
