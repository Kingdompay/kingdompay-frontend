# Backend Integration Guide

This frontend is built with React and Vite. It currently uses mock data and local state for demonstration purposes. To connect it to a real backend, follow these instructions.

## 1. API Configuration

The application uses a centralized `axios` instance configured in `src/services/api.js`. This service automatically handles:
- Base URL configuration from environment variables.
- Attaching the `Authorization` header with the JWT token.
- Global error handling (e.g., auto-logout on 401).

### Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

Set your API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### Using the API Service
Import the pre-configured `api` instance in your components or contexts:
```javascript
import api from '../services/api';

// Example GET request
const response = await api.get('/user/profile');

// Example POST request
await api.post('/auth/login', { email, password });
```

## 2. Authentication Flow

The app expects the following authentication endpoints:

### Login
- **Endpoint**: `POST /auth/login`
- **Payload**: `{ email, password }`
- **Response**:
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user" // 'user', 'institution', or 'admin'
    }
  }
  ```

### Register
- **Endpoint**: `POST /auth/register`
- **Payload**: `{ name, email, password, phone, ... }`
- **Response**: Same as login.

### Get Profile
- **Endpoint**: `GET /user/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object.

## 3. Required API Endpoints

### Community & Groups
- `GET /community/groups`: List all groups.
- `POST /community/groups`: Create a new group (Institution only).
- `POST /community/groups/:id/contribute`: Contribute funds to a group.
- `POST /community/groups/:id/withdraw`: Withdraw funds (Institution only).

### Transactions
- `GET /transactions`: List user transactions.
- `POST /transactions/send`: Send money.
- `POST /transactions/request`: Request money.

### Admin
- `GET /admin/stats`: Dashboard statistics.
- `GET /admin/verifications`: List pending identity verifications.
- `POST /admin/verifications/:id/approve`: Approve a user.
- `POST /admin/verifications/:id/reject`: Reject a user.

## 4. Role-Based Access Control (RBAC)

The frontend handles RBAC via `AuthContext`.
- **User**: Standard access.
- **Institution**: Can create groups and withdraw funds.
- **Admin**: Access to `/admin` dashboard.

Ensure your backend validates these roles for sensitive actions (e.g., only allow `institution` role to call `POST /community/groups`).

## 5. Deployment

1. **Build the Frontend**:
   ```bash
   npm run build
   ```
   This creates a `dist` folder.

2. **Serve the Static Files**:
   Upload the `dist` folder to your web server (Nginx, Apache, Vercel, Netlify) or serve it via your backend (e.g., Express `express.static`).

3. **Handle Client-Side Routing**:
   Configure your server to redirect all 404 requests to `index.html` so that React Router can handle the routing.
