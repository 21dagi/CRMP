# Authentication API Testing Guide

## Prerequisites
1. Ensure PostgreSQL is running
2. Run migrations: `npm run db:push`
3. Start the backend: `npm run start:dev`

## Endpoints

### 1. Register a New User
```bash
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null
  },
  "backendTokens": {
    "accessToken": "jwt-token-here"
  }
}
```

### 2. Login
```bash
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null
  },
  "backendTokens": {
    "accessToken": "jwt-token-here"
  }
}
```

## Error Responses

### Invalid Credentials (401)
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### User Already Exists (409)
```json
{
  "statusCode": 409,
  "message": "User already exists",
  "error": "Conflict"
}
```

### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```
