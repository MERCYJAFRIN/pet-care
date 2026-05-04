# API Testing Guide

## Using cURL for API Testing

### 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here"
}
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Get User Profile (Protected)

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create a Pet (Protected)

```bash
curl -X POST http://localhost:5000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Buddy",
    "type": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "weight": 30,
    "color": "Golden",
    "vaccinated": true,
    "neutered": true
  }'
```

### 5. Get All Pets (Protected)

```bash
curl -X GET http://localhost:5000/api/pets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Create an Appointment (Protected)

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "petId": "pet_uuid_here",
    "veterinarian": "Dr. Smith",
    "appointmentDate": "2026-03-01T10:00:00",
    "description": "Annual checkup"
  }'
```

### 7. Get All Appointments (Protected)

```bash
curl -X GET http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Using Postman

1. Import the API requests into Postman
2. Create environment variables for:
   - `base_url`: http://localhost:5000
   - `token`: (paste JWT token from login response)
3. Use `{{base_url}}` and `{{token}}` in requests

## Response Codes

- `200`: Success
- `201`: Created
- `400`: Bad request
- `401`: Unauthorized
- `404`: Not found
- `500`: Server error

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Additional error details"
}
```

## Authentication

Include JWT token in all protected endpoints:

```
Authorization: Bearer <token>
```

Tokens expire after 7 days.
