# JastNodes System Architecture & API Contracts

## System Overview

Полнофункциональная платформа для хостинга Minecraft серверов с интеграцией Pterodactyl Panel, включающая регистрацию, авторизацию, управление балансом и автоматическое создание серверов.

## Tech Stack

- **Frontend**: React 19, React Router, Context API
- **Backend**: FastAPI (Python), JWT Auth
- **Database**: MongoDB
- **External Integration**: Pterodactyl Panel API
- **Auth**: JWT Tokens (httpOnly cookies)

---

## Database Schema (MongoDB)

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  username: String (unique),
  password_hash: String (bcrypt),
  first_name: String,
  last_name: String,
  balance: Number (default: 0),
  pterodactyl_user_id: Number,
  pterodactyl_uuid: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Servers Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: Users),
  pterodactyl_server_id: Number,
  pterodactyl_identifier: String,
  name: String,
  plan: String (START, STONE, COAL, etc.),
  cpu: String,
  ram: String,
  storage: String,
  price: Number,
  location: String (РФ/Германия),
  ip: String (nullable),
  port: Number (nullable),
  status: String (pending, running, suspended),
  created_at: DateTime,
  expires_at: DateTime,
  renewed_at: DateTime
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: Users),
  type: String (deposit, purchase, refund),
  amount: Number,
  description: String,
  status: String (completed, pending, failed),
  created_at: DateTime
}
```

---

## Backend API Endpoints

### Authentication & User Management

#### POST /api/auth/register
**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "securepass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username"
  }
}
```

**Actions:**
1. Validate input
2. Hash password with bcrypt
3. Create user in MongoDB
4. Create user in Pterodactyl Panel via API
5. Store pterodactyl_user_id and pterodactyl_uuid
6. Generate JWT token
7. Return user data + token in httpOnly cookie

#### POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "status": "success",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "balance": 500
  }
}
```

**Actions:**
1. Find user by email
2. Verify password with bcrypt
3. Generate JWT token
4. Return user data + token in httpOnly cookie

#### POST /api/auth/logout
**Response:**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

**Actions:**
1. Clear httpOnly cookie
2. Return success

#### GET /api/auth/me
**Headers:** Authorization: Bearer <token>

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "username": "username",
  "balance": 500,
  "first_name": "John",
  "last_name": "Doe"
}
```

---

### Balance Management

#### GET /api/balance
**Headers:** Authorization: Bearer <token>

**Response:**
```json
{
  "balance": 500,
  "currency": "₽"
}
```

#### POST /api/balance/deposit (Fake for testing)
**Request:**
```json
{
  "amount": 1000
}
```

**Response:**
```json
{
  "status": "success",
  "new_balance": 1500,
  "transaction_id": "trans_id"
}
```

**Actions:**
1. Verify user authentication
2. Add amount to user balance
3. Create transaction record (type: deposit)
4. Return new balance

---

### Server Management

#### GET /api/servers/pricing
**Response:**
```json
{
  "plans": [
    {
      "id": "start",
      "name": "START",
      "cpu": "1 vCPU",
      "ram": "2 GB",
      "storage": "10 GB",
      "price": 39
    },
    ...
  ]
}
```

#### POST /api/servers/purchase
**Headers:** Authorization: Bearer <token>

**Request:**
```json
{
  "plan": "IRON",
  "location": "РФ",
  "server_name": "My Server"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Server created successfully",
  "server": {
    "id": "server_id",
    "name": "My Server",
    "plan": "IRON",
    "ip": "192.168.1.1",
    "port": 25565,
    "status": "pending"
  }
}
```

**Actions:**
1. Verify user authentication
2. Get plan details (CPU, RAM, Storage, Price)
3. Check if user has sufficient balance
4. Deduct price from user balance
5. Create server in Pterodactyl Panel:
   - Call Pterodactyl API to create server
   - Use Minecraft egg (egg_id from panel)
   - Assign resources based on plan
6. Save server to MongoDB with pterodactyl_server_id
7. Create transaction record (type: purchase)
8. Return server details

#### GET /api/servers/my-servers
**Headers:** Authorization: Bearer <token>

**Response:**
```json
{
  "servers": [
    {
      "id": "server_id",
      "pterodactyl_id": 123,
      "name": "My Server",
      "plan": "IRON",
      "cpu": "3 vCPU",
      "ram": "5 GB",
      "storage": "32 GB",
      "location": "РФ",
      "ip": "192.168.1.1",
      "port": 25565,
      "status": "running",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Actions:**
1. Find all servers for user from MongoDB
2. For each server, fetch current status from Pterodactyl API
3. Update status in MongoDB if changed
4. Return server list

#### GET /api/servers/:id
**Headers:** Authorization: Bearer <token>

**Response:**
```json
{
  "id": "server_id",
  "name": "My Server",
  "plan": "IRON",
  "cpu": "3 vCPU",
  "ram": "5 GB",
  "storage": "32 GB",
  "location": "РФ",
  "ip": "192.168.1.1",
  "port": 25565,
  "status": "running",
  "created_at": "2024-01-01T00:00:00Z",
  "pterodactyl_panel_url": "https://console.jastnodes.ru"
}
```

---

## Frontend Architecture

### React Context (AuthContext)

```javascript
const AuthContext = {
  user: {
    id: String,
    email: String,
    username: String,
    balance: Number
  },
  isAuthenticated: Boolean,
  login: (email, password) => Promise,
  register: (data) => Promise,
  logout: () => Promise,
  updateBalance: (newBalance) => void
}
```

### Routes

```javascript
/ - Home page (Hero, Pricing, Testimonials)
/login - Login page
/register - Register page
/dashboard - User dashboard (Protected)
  - Shows balance
  - Shows active servers
  - Button to purchase new server
/servers - My Servers page (Protected)
  - List of all user servers
  - Server details
```

### Protected Routes
Используем ProtectedRoute wrapper для защиты страниц:
```javascript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## Pterodactyl Integration Details

### API Configuration
- Base URL: https://console.jastnodes.ru
- API Key: ptla_M1UMYribzZRG9h8QVFfNOCBsUMeMBIZjMkWuwsg3aCw
- API Type: Application API

### User Creation Flow
1. User registers on website
2. Backend creates user in MongoDB with hashed password
3. Backend calls Pterodactyl API to create user:
   ```
   POST /api/application/users
   {
     "email": "user@example.com",
     "username": "username",
     "first_name": "John",
     "last_name": "Doe"
   }
   ```
4. Store pterodactyl_user_id and pterodactyl_uuid in MongoDB

### Server Creation Flow
1. User purchases a server plan
2. Backend verifies balance and deducts payment
3. Backend calls Pterodactyl API to create server:
   ```
   POST /api/application/servers
   {
     "name": "Server Name",
     "user": pterodactyl_user_id,
     "egg": minecraft_egg_id,
     "docker_image": "ghcr.io/pterodactyl/yolks:java_17",
     "startup": "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar",
     "limits": {
       "memory": 5120,
       "disk": 32768,
       "cpu": 300
     },
     "deploy": {
       "locations": [location_id],
       "dedicated_ip": false,
       "port_range": []
     }
   }
   ```
4. Store server details in MongoDB with pterodactyl_server_id

### Server Status Updates
- Fetch server status from Pterodactyl on demand
- Use Pterodactyl Client API to get real-time status
- Cache status updates for performance

---

## Mock Data (Frontend Only - To Remove)

Файл: `/app/frontend/src/mockData.js`
- Содержит тарифные планы (pricingPlans)
- Содержит отзывы (testimonials)
- Эти данные уже используются в компонентах Pricing и Testimonials
- **После создания backend нужно удалить mock данные и получать через API**

---

## Security Considerations

1. **JWT Tokens**: 
   - Store in httpOnly cookies
   - Set expiration (7 days)
   - Include user_id and email in payload

2. **Password Hashing**: 
   - Use bcrypt with salt rounds = 12

3. **API Keys**:
   - Store Pterodactyl API key in .env
   - Never expose in frontend
   - Use environment variables

4. **Input Validation**:
   - Validate all inputs on backend
   - Use Pydantic models for validation
   - Sanitize user inputs

5. **Rate Limiting**:
   - Implement rate limiting on auth endpoints
   - Limit failed login attempts

---

## Implementation Plan

### Phase 1: Backend Setup
1. Install dependencies (httpx, pyjwt, passlib, bcrypt)
2. Create MongoDB models
3. Setup JWT authentication
4. Create Pterodactyl client

### Phase 2: Auth Implementation
1. Register endpoint with Pterodactyl user creation
2. Login endpoint with JWT
3. Logout endpoint
4. Protected route middleware

### Phase 3: Balance & Transactions
1. Balance endpoints
2. Fake deposit for testing
3. Transaction logging

### Phase 4: Server Management
1. Purchase server endpoint
2. Create server in Pterodactyl
3. List user servers
4. Server details

### Phase 5: Frontend Integration
1. Create AuthContext
2. Login/Register pages
3. Dashboard page
4. Protected routes
5. Server purchase flow
6. My Servers page

---

## Testing Strategy

1. **Manual Testing**: Test each endpoint with curl/Postman
2. **Frontend Testing**: Test registration → login → purchase → view servers flow
3. **Pterodactyl Integration**: Verify users and servers are created in panel

---

## Notes

- Pterodactyl egg_id and location_id need to be fetched from panel
- Docker images for Minecraft: `ghcr.io/pterodactyl/yolks:java_17`
- Startup command can be customized per plan
- Balance is stored in rubles (₽)
