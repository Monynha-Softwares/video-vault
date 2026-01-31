import { z } from 'zod';

/**
 * Shared validation schemas for consistent validation across the application
 * Following the DRY principle to eliminate duplicate validation logic
 */

// Email validation
export const emailSchema = z.string().email('auth.error.invalidEmail');

// Password validation (minimum 6 characters)
export const passwordSchema = z.string().min(6, 'auth.error.passwordMinLength');

// Username validation (minimum 3 characters)
export const usernameSchema = z.string().min(3, 'auth.error.usernameMinLength');

// Optional username (allows empty string or meets minimum requirements)
export const optionalUsernameSchema = usernameSchema.optional().or(z.literal(''));

/**
 * Password confirmation refinement
 * Use this to validate that password and confirmPassword match
 * 
 * @example
 * const schema = z.object({
 *   password: passwordSchema,
 *   confirmPassword: passwordSchema,
 * }).refine(...passwordMatchRefinement);
 */
export const passwordMatchRefinement = {
  check: (data: { password: string; confirmPassword: string }) => 
    data.password === data.confirmPassword,
  message: 'auth.resetPassword.error.passwordMismatch',
  path: ['confirmPassword'] as const,
};

/**
 * Helper to create a password confirmation schema
 * Automatically includes password match validation
 */
export const createPasswordConfirmationSchema = (messageKey = 'auth.resetPassword.error.passwordMismatch') =>
  z.object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: messageKey,
      path: ['confirmPassword'],
    }
  );
