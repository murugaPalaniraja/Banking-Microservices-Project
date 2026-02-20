# Banking Microservices Project

A simplified digital banking application using microservices architecture built with **Java Spring Boot** (backend) and **React** (frontend).

## Architecture

| Service | Port | Description |
|---------|------|-------------|
| Eureka Server | 8761 | Service Discovery |
| API Gateway | 8080 | Single entry point (Spring Cloud Gateway) |
| User Service | 8081 | Registration, Login (JWT), User management |
| Account Service | 8082 | Create account, View balance, List accounts |
| Transaction Service | 8083 | Fund transfer, Transaction history |
| Frontend (React) | 3000 | Login, Dashboard, Transfer, Transactions |

## Tech Stack

- **Backend**: Java 21, Spring Boot 3.2.5, Spring Cloud 2023.0.1
- **Frontend**: React 19, Vite, Axios, React Router
- **Database**: H2 In-Memory (per service)
- **Auth**: JWT (24-hour expiry)
- **Service Discovery**: Netflix Eureka

## How to Run

### Prerequisites
- Java 21+
- Maven
- Node.js 18+
- npm

### 1. Start Eureka Server (first)
```bash
cd eureka-server
mvn spring-boot:run
```
Verify at: http://localhost:8761

### 2. Start API Gateway
```bash
cd api-gateway
mvn spring-boot:run
```

### 3. Start User Service
```bash
cd user-service
mvn spring-boot:run
```

### 4. Start Account Service
```bash
cd account-service
mvn spring-boot:run
```

### 5. Start Transaction Service
```bash
cd transaction-service
mvn spring-boot:run
```

### 6. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:3000

## Sample Credentials

| Email | Password | Name |
|-------|----------|------|
| arjun@example.com | password123 | Arjun Ramakrishnan |
| priya@example.com | password123 | Priya Lakshmi |

### Pre-created Accounts

| Account Number | User | Balance | Type |
|----------------|------|---------|------|
| 1000000001 | Arjun Ramakrishnan | ₹5,000.00 | SAVINGS |
| 1000000002 | Arjun Ramakrishnan | ₹10,000.00 | CURRENT |
| 1000000003 | Priya Lakshmi | ₹7,500.00 | SAVINGS |

## API Endpoints

### User Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login, returns JWT |
| GET | `/api/users/{id}` | Get user details |

### Account Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts` | Create new account |
| GET | `/api/accounts/user/{userId}` | List user accounts |
| GET | `/api/accounts/{accountNumber}` | Get account by number |
| PUT | `/api/accounts/update-balance` | Update balance (internal) |

### Transaction Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/transfer` | Transfer funds |
| GET | `/api/transactions/account/{accountNumber}` | Transaction history (last 20) |

## Project Structure
```
/eureka-server        — Service Discovery (Port 8761)
/api-gateway          — API Gateway (Port 8080)
/user-service         — User Management + JWT Auth (Port 8081)
/account-service      — Account Management (Port 8082)
/transaction-service  — Transaction Management (Port 8083)
/frontend             — React SPA (Port 3000)
README.md
docker-compose.yml
```

## Database Schema Note

The application uses H2 in-memory databases for each service. To avoid conflicts with H2 reserved keywords (e.g., `USERS`, `TRANSACTIONS`, `ACCOUNTS`), the tables have been named as:
- `app_users` (instead of `users`)
- `app_accounts` (instead of `accounts`)
- `app_transactions` (instead of `transactions`)

## Challenges Faced

1.  **H2 Reserved Words**: Encountered SQL syntax errors when using standard table names like `users`. Resolved this by prefixing tables with `app_`.
2.  **Database Initialization Timing**: Hibernate sometimes attempted to create tables *after* `data.sql` was executed. Solved by setting `spring.jpa.defer-datasource-initialization: true`.
3.  **Docker Networking**: Ensuring all microservices could register with Eureka using their container names rather than `localhost`.
4.  **Style Iteration**: Transitioning from a modern dark mode to a minimal neubrutalist light theme while maintaining layout integrity.

## Estimated Time Spent

~8 hours (Initial setup + Dockerization + Debugging 503s + Feature addition + Redesign)

