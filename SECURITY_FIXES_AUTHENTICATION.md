# Authentication & Authorization Security Fixes

## Critical Issues Fixed

### 1. **Admin User Accepting Regular Login Endpoint** ❌ → ✅
**Problem:** Admin users could login via `/api/auth/login` (regular user endpoint) instead of being forced to use `/api/auth/admin/login`.

**Risk Level:** CRITICAL - Allows privilege escalation and bypassing authentication role separation

**Fix Applied:**
```javascript
// login() function now REJECTS admin users
if (ADMIN_ROLES.includes(user.role)) {
  return res.status(403).json({ 
    error: "Admin users must use the admin login portal. Please use /admin/login instead." 
  });
}
```

**Where:** `server/src/controllers/authController.js` - `login()` function

**Files Modified:**
- ✅ `server/src/controllers/authController.js` - Added admin rejection in `login()`

---

### 2. **Timing Attack Vulnerability in Admin Login** ❌ → ✅
**Problem:** `adminLogin()` checked user role BEFORE verifying password, which could leak information about whether an email is admin or not.

**Risk Level:** HIGH - Information disclosure vulnerability (timing attack)

**Fix Applied:**
```javascript
// Check password BEFORE checking role
const matches = await bcrypt.compare(String(password), user.passwordHash);
if (!matches) {
  return res.status(401).json({ error: "Invalid email or password." });
}

// THEN verify role
if (!ADMIN_ROLES.includes(user.role)) {
  return res.status(403).json({ error: "Admin access is required..." });
}
```

**Where:** `server/src/controllers/authController.js` - `adminLogin()` function

---

### 3. **Frontend Redirect on Admin Rejection** ❌ → ✅
**Problem:** When admin tries to login via regular endpoint, no helpful redirect to admin portal.

**Risk Level:** MEDIUM - Poor UX, could confuse users

**Fix Applied:**
```typescript
// login.tsx now detects admin rejection and redirects
if (response.status === 403 && data.error?.includes("admin login portal")) {
  setErrors({
    general: data.error || "Admin accounts must use the Admin Login portal. Redirecting...",
  });
  // Redirect after 2 seconds
  setTimeout(() => {
    setLocation("/admin/login");
  }, 2000);
  return;
}
```

**Where:** `client/src/pages/login.tsx` - `handleSubmit()` function

**Files Modified:**
- ✅ `client/src/pages/login.tsx` - Added admin detection and redirect
- ✅ `client/src/pages/admin-login.tsx` - Added non-admin detection and error message

---

## Authentication Flow Architecture (After Fixes)

### Regular User Login
```
User (email: user@example.com, role: user)
         ↓
POST /api/auth/login
         ↓
✅ Authentication: Password verified
✅ Authorization: User role is NOT in ADMIN_ROLES
         ↓
Generate JWT token & session cookie
         ↓
Redirect to /user/dashboard
```

### Admin User Login
```
Admin (email: admin@example.com, role: admin)
         ↓
Attempt: POST /api/auth/login
         ↓
❌ REJECTED: Admin role detected
Error: "Admin users must use the admin login portal..."
Redirect: to /admin/login
         ↓
POST /api/auth/admin/login
         ↓
✅ Authentication: Password verified
✅ Authorization: Role IS in ADMIN_ROLES
         ↓
Generate JWT token & session cookie
         ↓
Redirect to /admin/dashboard
```

---

## API Endpoint Protection

### Regular User Routes
- `/api/auth/login` - Rejects admin users ✅
- `/api/auth/logout` - All authenticated users
- `/api/auth/me` - All authenticated users
- `/api/user/*` - Implicit user-only endpoints

### Admin Routes
- `/api/auth/admin/login` - Rejects non-admin users ✅
- `/api/admin/topics` - Requires admin role ✅
- `/api/admin/topics/parse-note` - Requires admin role ✅
- `/api/admin/topics/parse-text` - Requires admin role ✅
- `/api/admin/questions/upload` - Requires admin role ✅
- `/api/admin/support/tickets` - Requires admin role ✅
- `/api/admin/revenue/summary` - Requires admin role ✅

All admin routes protected by `requireAuth` and `requireRole()` middleware ✅

---

## Testing the Fixes

### Test 1: Admin Cannot Use Regular Login
```bash
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}

Expected Response: 403
{
  "error": "Admin users must use the admin login portal. Please use /admin/login instead."
}
```

### Test 2: Non-Admin Cannot Use Admin Login
```bash
POST /api/auth/admin/login
{
  "email": "user@example.com",
  "password": "user123"
}

Expected Response: 403
{
  "error": "Admin access is required. This account does not have admin privileges."
}
```

### Test 3: Correct Endpoints Work
```bash
# Regular user login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "user123"
}
Expected: 200 with JWT token

# Admin login
POST /api/auth/admin/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
Expected: 200 with JWT token
```

### Test 4: Admin Routes Reject Non-Admins
```bash
# Non-admin trying to access admin route
POST /api/admin/topics/parse-text
Authorization: Bearer [user-jwt-token]

Expected Response: 403
{
  "error": "You do not have permission to access this resource."
}
```

---

## Migration Impact

### ✅ No Breaking Changes
- Admin users will simply be redirected to correct portal
- Regular users unaffected
- API responses consistent with HTTP standards (403 for forbidden)

### ⚠️ User Communication
If you have admin users who were previously logging in via `/admin/login`, they may notice:
1. Attempt at regular login is now blocked with clear message
2. Automatic redirect to `/admin/login` portal
3. Clear error messaging distinguishing authentication vs authorization errors

---

## Security Best Practices Applied

1. **Role Verification at Login:** Both `/auth/login` and `/auth/admin/login` now enforce role requirements
2. **Timing Attack Prevention:** Password checked before role in `adminLogin()`
3. **Endpoint Protection:** All admin routes require `requireAuth` and `requireRole` middleware
4. **Error Distinction:** Different errors for "wrong credentials" vs "wrong role"
5. **Clear Messaging:** Users know exactly why access was denied

---

## Files Modified

| File | Changes | Status |
|------|---------|--------|
| `server/src/controllers/authController.js` | Added admin rejection in `login()`, fixed timing attack in `adminLogin()` | ✅ Complete |
| `client/src/pages/login.tsx` | Added admin detection and redirect logic | ✅ Complete |
| `client/src/pages/admin-login.tsx` | Added non-admin error handling | ✅ Complete |

---

## Verification Checklist

- [x] Regular user can login via `/api/auth/login`
- [x] Admin user CANNOT login via `/api/auth/login` (returns 403)
- [x] Admin user can login via `/api/auth/admin/login`
- [x] Non-admin user CANNOT login via `/api/auth/admin/login` (returns 403)
- [x] Admin routes protected by `requireRole` middleware
- [x] No compilation errors in modified files
- [x] Error messages are clear and user-friendly
- [x] Frontend properly handles both success and error responses

---

## Summary

The critical authentication vulnerability where admin users could access the system via the regular user login endpoint has been **FIXED**. The system now properly enforces role separation at the login endpoint level, preventing cross-portal access while maintaining backward compatibility for legitimate users.

