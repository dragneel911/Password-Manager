# Password Manager

Full-stack password manager: Node/Express REST API (raw parameterized SQL via `pg`,
no ORM) + PostgreSQL + React (Vite) frontend. Vault passwords are encrypted at rest
with AES-256-GCM using a per-user key derived via HKDF; master passwords are hashed
with bcrypt; sessions use a JWT in an httpOnly cookie.

## Setup

1. Install PostgreSQL locally and create two databases:
   ```
   psql -U postgres -c "CREATE DATABASE password_manager;"
   psql -U postgres -c "CREATE DATABASE password_manager_test;"
   ```
2. Backend:
   ```
   cd server
   cp .env.example .env   # fill in DATABASE_URL, TEST_DATABASE_URL, JWT_SECRET, ENCRYPTION_KEY
   npm install
   npm run db:migrate
   npm run db:migrate:test
   npm test
   npm start
   ```
3. Frontend (separate terminal):
   ```
   cd client
   npm install
   npm run dev
   ```
4. Open the URL Vite prints (typically `http://localhost:5173`).

## Security notes

- All SQL queries are parameterized (`$1, $2, ...`) — no string concatenation, so
  SQL injection is not possible through this API.
- Server-side AES-256-GCM encryption, not zero-knowledge: the server operator could
  technically decrypt vault data. A true zero-knowledge design (client-side key
  derivation and encryption) is a natural next step.
