# NextAuth Integration Guide

## Overview
This frontend application uses NextAuth.js to authenticate against the NestJS backend. The authentication flow uses JWT tokens and credential-based login.

## Architecture

### Authentication Flow
1. User enters credentials on `/auth/signin` or `/auth/signup`
2. Frontend calls NestJS backend (`http://localhost:3001/auth/login` or `/auth/register`)
3. Backend validates credentials and returns user data + JWT token
4. NextAuth stores the backend JWT in the session
5. Protected pages check authentication status using `useAuth()` hook

## Files Created

### Core Configuration
- **`src/lib/auth.ts`**: NextAuth configuration with CredentialsProvider
- **`app/api/auth/[...nextauth]/route.ts`**: NextAuth API route handler
- **`types/next-auth.d.ts`**: TypeScript type extensions for Session/User/JWT

### Components & Hooks
- **`src/components/providers/session-provider.tsx`**: Client-side SessionProvider wrapper
- **`src/hooks/use-auth.ts`**: Custom hook for accessing auth state

### Pages
- **`app/auth/signin/page.tsx`**: Sign-in page
- **`app/auth/signup/page.tsx`**: Sign-up page (registers with backend)
- **`app/dashboard/page.tsx`**: Protected dashboard with auth check

### Configuration
- **`.env.local`**: Environment variables for NextAuth

## Key Features

### 1. Credentials Provider
The `CredentialsProvider` in `src/lib/auth.ts` handles:
- Fetching to NestJS backend login endpoint
- Validating credentials
- Returning user object with backend JWT token

### 2. JWT Callback
Appends the `accessToken` from NestJS to the NextAuth JWT:
```typescript
async jwt({ token, user }) {
  if (user) {
    token.accessToken = user.accessToken;
    token.id = user.id;
  }
  return token;
}
```

### 3. Session Callback
Passes the `accessToken` to the session object for client access:
```typescript
async session({ session, token }) {
  if (session.user) {
    session.user.accessToken = token.accessToken;
    session.user.id = token.id;
  }
  return session;
}
```

### 4. Type Safety
Extended NextAuth types to include:
- `session.user.id`
- `session.user.accessToken`

## Usage Examples

### Accessing User Data
```typescript
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, accessToken, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Making Authenticated API Calls
```typescript
const { accessToken } = useAuth();

const response = await fetch('http://localhost:3001/api/protected', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});
```

### Protecting Pages
```typescript
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return null;

  return <div>Protected Content</div>;
}
```

### Sign Out
```typescript
import { signOut } from "next-auth/react";

const handleSignOut = async () => {
  await signOut({ redirect: false });
  router.push("/");
};
```

## Environment Variables

Required in `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=my-super-secure-shared-secret-key-123
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Important**: The `NEXTAUTH_SECRET` should match the `JWT_SECRET` in your backend for consistency, though they serve different purposes.

## Testing the Integration

### 1. Start Backend
```bash
cd backend
npm run start:dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow
1. Navigate to `http://localhost:3000`
2. Click "Log In / Get Started"
3. Click "Sign up" to create an account
4. Fill in name, email, and password
5. You'll be auto-signed in and redirected to dashboard
6. Test sign out from the user dropdown

## Security Considerations

1. **HTTPS in Production**: Always use HTTPS in production
2. **Secret Management**: Use strong, unique secrets for `NEXTAUTH_SECRET`
3. **Token Expiration**: Backend JWT tokens expire in 7 days (configurable in backend)
4. **CORS**: Backend is configured to accept requests from `http://localhost:3000`

## Troubleshooting

### "Invalid credentials" error
- Verify backend is running on port 3001
- Check network tab for failed requests
- Ensure email/password are correct

### Session not persisting
- Check that `NEXTAUTH_SECRET` is set in `.env.local`
- Clear browser cookies and try again
- Verify SessionProvider is wrapping the app in `app/layout.tsx`

### TypeScript errors
- Ensure `types/next-auth.d.ts` is in the project root
- Restart TypeScript server in your IDE

## Next Steps

1. **Add OAuth Providers**: Extend `authOptions` to include Google, GitHub, etc.
2. **Refresh Tokens**: Implement token refresh logic in JWT callback
3. **Role-Based Access**: Add user roles to session and protect routes accordingly
4. **Middleware**: Use Next.js middleware for server-side route protection
