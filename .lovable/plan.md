
# Account Management System Redesign Plan

## Executive Summary

This plan addresses critical issues with the user account management system and proposes a complete redesign to align with best practices. The redesign will fix the broken password reset flow, add missing account settings functionality, and improve overall code organization.

---

## Identified Issues

### Issue 1: Password Reset Page Not Loading
**Root Cause**: The password reset flow redirects to `/auth?reset=true`, but the Auth page doesn't handle this query parameter. There's no code to:
- Detect the `?reset=true` query parameter
- Parse the recovery token from the URL hash/parameters
- Show a "Set New Password" form
- Call `supabase.auth.updateUser()` to update the password

### Issue 2: No Account Settings Page
**Missing Functionality**: Users cannot:
- Change their password while logged in
- Update their email address
- Delete their account (if desired)

The current EditProfile page only handles profile data (display name, avatar, bio, social accounts), not authentication credentials.

### Issue 3: Build Errors (Pre-existing)
Multiple TypeScript errors exist due to missing table definitions in the Supabase types file:
- `comments` table not in types (but exists in database)
- `user_social_accounts` table not in types (but exists in database)
- Missing `Locale` type import in CommentItem.tsx
- Type mismatches in playlist and video APIs

---

## Proposed Solution

### Phase 1: Fix Password Reset Flow

**1.1 Create Password Reset Handler Component**

Create a new component that:
- Detects password reset mode from URL (`?reset=true` or hash token)
- Shows a "Set New Password" form with password confirmation
- Calls `supabase.auth.updateUser({ password: newPassword })`
- Handles errors gracefully

**1.2 Update Auth Page**

Modify `src/pages/Auth.tsx` to:
- Parse URL for reset tokens on mount
- Show the password reset form when in reset mode
- Handle the `PASSWORD_RECOVERY` auth event

**1.3 Add Auth API Function**

Add to `src/features/auth/auth.api.ts`:
```typescript
export async function updateUserPassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error as Error | null };
}

export async function updateUserEmail(newEmail: string, redirectTo?: string) {
  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  }, {
    emailRedirectTo: redirectTo ?? `${window.location.origin}/auth`,
  });
  return { error: error as Error | null };
}
```

### Phase 2: Create Account Settings Page

**2.1 New Route: `/account/settings`**

Create `src/pages/AccountSettings.tsx` with sections for:

1. **Email Management**
   - Display current email
   - Form to change email (requires re-authentication for security)
   - Shows pending email change status

2. **Password Management**
   - Form to change password (current password + new password + confirmation)
   - Password strength indicator

3. **Account Actions**
   - Option to sign out of all devices
   - Account deletion request (optional, future enhancement)

**2.2 Update Navigation**

Add "Account Settings" link to:
- Header dropdown menu (Settings icon)
- Mobile navigation menu
- EditProfile page (as a link/section)

**2.3 Update App Router**

Add route in `src/App.tsx`:
```typescript
<Route path="/account/settings" element={<AccountSettings />} />
```

### Phase 3: Fix Build Errors

**3.1 Fix Missing Locale Type**

In `src/components/comment/CommentItem.tsx`:
- Import `Locale` type from `date-fns`

**3.2 Type Definitions**

The `comments` and `user_social_accounts` tables exist in the database but are missing from the auto-generated types. This requires:
- Regenerating Supabase types (external action, outside Lovable)
- OR: Creating manual type overrides

**3.3 Fix PlaylistImportDialog**

- Add missing `course_code` and `unit_code` fields to playlist creation
- Replace `toast.warn` with `toast.warning` or `toast.error`

**3.4 Fix Other Type Errors**

- Fix playlist collaborators type cast
- Fix video API return types
- Fix usePlaylists options type

---

## Implementation Details

### New Files to Create

| File | Purpose |
|------|---------|
| `src/pages/AccountSettings.tsx` | Account settings page |
| `src/components/account/ChangeEmailForm.tsx` | Email change form |
| `src/components/account/ChangePasswordForm.tsx` | Password change form |
| `src/components/auth/ResetPasswordForm.tsx` | Reset password form (from email link) |

### Files to Modify

| File | Changes |
|------|---------|
| `src/features/auth/auth.api.ts` | Add updateUserPassword, updateUserEmail |
| `src/features/auth/useAuth.tsx` | Expose session for re-auth flows |
| `src/pages/Auth.tsx` | Handle password recovery token and show reset form |
| `src/App.tsx` | Add /account/settings route |
| `src/components/Header.tsx` | Add Account Settings navigation |
| `src/i18n/locales/en.json` | Add translation keys |
| `src/components/comment/CommentItem.tsx` | Fix Locale import |
| `src/components/playlist/PlaylistImportDialog.tsx` | Fix type and toast errors |

### Translation Keys to Add

```json
{
  "account": {
    "settings": {
      "title": "Account Settings",
      "description": "Manage your account security and credentials",
      "emailSection": {
        "title": "Email Address",
        "current": "Current email",
        "change": "Change email",
        "newEmail": "New email address",
        "confirmChange": "Update Email"
      },
      "passwordSection": {
        "title": "Password",
        "change": "Change password",
        "currentPassword": "Current password",
        "newPassword": "New password",
        "confirmPassword": "Confirm new password",
        "update": "Update Password"
      },
      "success": {
        "emailUpdated": "Email update request sent. Check your new email for confirmation.",
        "passwordUpdated": "Password updated successfully"
      },
      "error": {
        "passwordMismatch": "Passwords do not match",
        "currentPasswordRequired": "Current password is required",
        "samePassword": "New password must be different from current"
      }
    }
  },
  "auth": {
    "resetPassword": {
      "title": "Set New Password",
      "description": "Enter your new password below",
      "newPassword": "New password",
      "confirmPassword": "Confirm password",
      "submit": "Reset Password",
      "success": "Password reset successfully! Redirecting...",
      "error": "Failed to reset password"
    }
  }
}
```

---

## User Flow Diagrams

### Password Reset Flow (Fixed)

```text
User clicks "Forgot Password"
        ↓
    Enters email
        ↓
  Receives email with link
        ↓
  Clicks link → /auth?reset=true#token=xxx
        ↓
  Auth page detects reset mode
        ↓
  Shows "Set New Password" form
        ↓
  User enters new password
        ↓
  supabase.auth.updateUser() called
        ↓
  Success → Redirect to login
```

### Account Settings Flow (New)

```text
Logged-in user clicks Settings
        ↓
  /account/settings page loads
        ↓
  User sees: Email | Password | Security
        ↓
  To change password:
    - Enter current password
    - Enter new password (2x)
    - Submit → supabase.auth.updateUser()
        ↓
  Success toast → Stay on page
```

---

## Technical Considerations

### Security Best Practices

1. **Password Requirements**
   - Minimum 6 characters (Supabase default)
   - Optional: Add strength meter

2. **Email Change**
   - Sends confirmation to new email
   - User must verify before change takes effect

3. **Session Handling**
   - After password change, optionally invalidate other sessions
   - Auth state updates automatically via onAuthStateChange

### Supabase Configuration Required

The user should verify these settings in Supabase Dashboard:
- **Authentication > URL Configuration > Site URL**: Set to production URL
- **Authentication > URL Configuration > Redirect URLs**: Include both preview and production URLs
- **Email Templates**: Customize password reset email if desired

---

## Estimated Implementation Scope

| Task | Complexity |
|------|------------|
| Password reset form + Auth page updates | Medium |
| Account Settings page with forms | Medium |
| Navigation updates | Low |
| Translation additions | Low |
| Build error fixes | Low-Medium |
| Testing and polish | Medium |

---

## Success Criteria

After implementation:
1. Users can reset their password via email link (form loads correctly)
2. Users can change their password while logged in
3. Users can change their email address while logged in
4. All build errors are resolved
5. Navigation to account settings is clear and accessible
