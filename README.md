# Chat App

## Overview

A full-stack, real-time messaging application built with React, Express, Socket.IO, MongoDB, and Redis. Users can register, sign in, add contacts by email, and exchange direct messages with online presence indicators and persistent conversation history.

## Problem Statement

A chat application needs to deliver messages immediately while preserving conversation history, identifying authenticated users, and keeping presence information up to date. This project combines HTTP APIs for account and history operations with socket events for live messaging.

## Objectives

- Build a simple interface for one-to-one communication.
- Authenticate users and manage sessions with JWT and Redis.
- Persist users, contacts, conversations, and messages in MongoDB.
- Encrypt message content before database storage.
- Track online users and limit excessive requests and message traffic.

## Features

- Registration with unique usernames and emails, plus bcrypt password hashing.
- JWT login, protected API routes, and a protected chat page.
- Contact management by registered email address.
- Real-time direct messaging through Socket.IO.
- Stored conversations and chronological message history.
- Online/offline presence backed by Redis.
- Session replacement logic that disconnects an earlier socket when a new one connects for the same user.
- AES-256-GCM encryption of message content in MongoDB. The server encrypts and decrypts messages; this is storage encryption, not end-to-end encryption.
- Redis-backed HTTP and socket message rate limiting.
- A health endpoint and an integration benchmark script.

Delivery receipts and typing indicators are not complete features. See the current limitations under **Challenges & Solutions**.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, React Router 7, CSS, Create React App |
| Client networking | Axios, Socket.IO Client 4 |
| Backend | Node.js, Express 5, Socket.IO 4 |
| Database | MongoDB with Mongoose 8 |
| Temporary state | Redis with ioredis |
| Authentication | JSON Web Tokens, bcrypt |
| Encryption | Node.js `crypto`, AES-256-GCM |
| Rate limiting | express-rate-limit, rate-limit-redis |
| Configuration | dotenv and React environment variables |

## System Architecture

```mermaid
flowchart LR
    UI[React browser client] <-->|HTTP /api| API[Express routes and controllers]
    UI <-->|Socket.IO events| WS[Socket handler]
    API --> Services[Application services]
    WS --> Services
    Services <-->|Users, chats, encrypted messages| DB[(MongoDB)]
    API <--> Redis[(Redis)]
    WS <--> Redis
    Services <-->|Sessions and presence| Redis
```

Express and Socket.IO share one HTTP server. MongoDB stores durable data, while Redis stores session timestamps, presence mappings, and rate-limit counters. Socket delivery currently uses the running server's local socket registry; a distributed Socket.IO adapter is not configured.

## Project Structure

```text
chat-app/
|-- README.md
|-- .gitignore
|-- pass.txt
|-- test.txt
|-- client/
|   |-- .gitignore
|   |-- README.md
|   |-- package.json
|   |-- package-lock.json
|   |-- public/
|   `-- src/
|       |-- index.js / index.css
|       |-- App.js / App.css
|       |-- assets/
|       |-- components/
|       |-- pages/
|       |-- services/api.js
|       `-- socket/socket.js
`-- server/
    |-- package.json
    |-- package-lock.json
    |-- test-socket.js
    |-- test-user1.js
    |-- test-user2.js
    |-- scripts/
    |   |-- resume-benchmark.js
    |   `-- RESUME-BENCHMARK.md
    `-- src/
        |-- server.js
        |-- app.js
        |-- config/
        |-- middleware/
        |-- modules/
        |   |-- auth/
        |   |-- chat/
        |   |-- message/
        |   |-- presence/
        |   |-- socket/
        |   `-- user/
        `-- utils/
```

## Each file / folder purpose briefly (short)

Paths below are relative to the repository root. Related files are grouped for brevity.

| Path | Purpose |
| --- | --- |
| `README.md` | Project documentation and setup instructions. |
| `.gitignore`, `client/.gitignore` | Exclude dependencies, environment files, and generated output. |
| `pass.txt`, `test.txt` | Auxiliary text files; not needed for application startup. |
| `client/` | React frontend. |
| `client/README.md` | Create React App usage notes. |
| `client/package.json`, `server/package.json` | Dependencies and npm scripts for each application. |
| `client/package-lock.json`, `server/package-lock.json` | Locked dependency versions. |
| `client/public/index.html` | HTML shell containing the React mount point. |
| `client/public/favicon.ico`, `logo192.png`, `logo512.png` | Browser and application icons. |
| `client/public/manifest.json`, `robots.txt` | Web app metadata and crawler instructions. |
| `client/src/index.js`, `index.css` | React entry point and global styles. |
| `client/src/App.js`, `App.css` | Page routes and shared application styles. |
| `client/src/assets/chat.png`, `online.png` | Chat and presence image assets. |
| `client/src/components/ProtectedRoute.js` | Redirect users without a session token to login. |
| `client/src/components/UIIcon.js` | Shared UI icons. |
| `client/src/pages/Login.js`, `Register.js`, `Chat.js` | Page state, API calls, and interaction logic. |
| `client/src/pages/LoginUI.js`, `RegisterUI.js`, `ChatUI.js` | Page presentation components. |
| `client/src/pages/auth.css`, `login.css`, `register.css`, `chat.css` | Authentication and chat styles. |
| `client/src/pages/bg.jpg` | Background image asset. |
| `client/src/services/api.js` | Axios instance that attaches the session token. |
| `client/src/socket/socket.js` | Socket connection and forced-logout handling. |
| `server/src/server.js` | Loads configuration, connects MongoDB, and starts HTTP and Socket.IO. |
| `server/src/app.js` | Express middleware, API routes, and health endpoint. |
| `server/src/config/db.js`, `redis.js`, `socket.js` | MongoDB, Redis, and Socket.IO initialization. |
| `server/src/middleware/auth.middleware.js` | JWT and Redis session validation. |
| `server/src/middleware/rateLimiter.middleware.js` | HTTP and socket rate-limit helpers. |
| `server/src/middleware/error.middleware.js` | Empty placeholder for shared error handling. |
| `server/src/modules/auth/auth.model.js` | User schema, including contacts and hashed passwords. |
| `server/src/modules/auth/auth.routes.js`, `auth.controller.js`, `auth.service.js` | Registration/login routing, responses, and business logic. |
| `server/src/modules/chat/chat.model.js` | Conversation participants and last-message reference. |
| `server/src/modules/chat/chat.routes.js`, `chat.controller.js` | Conversation and message-history endpoints. |
| `server/src/modules/chat/chat.service.js` | Finds or creates a conversation between two users. |
| `server/src/modules/message/message.model.js` | Message content, participants, timestamps, and status schema. |
| `server/src/modules/message/message.service.js` | Saves encrypted messages and decrypts message history. |
| `server/src/modules/presence/presence.service.js` | Redis user-to-socket mappings and online-user queries. |
| `server/src/modules/socket/events.js` | Socket event names, including some not yet implemented. |
| `server/src/modules/socket/socket.handler.js` | Socket authentication, messaging, presence, and disconnect handling. |
| `server/src/modules/user/user.routes.js`, `user.controller.js` | Contact lookup and addition endpoints. |
| `server/src/modules/user/user.service.js` | Empty service placeholder. |
| `server/src/utils/encryption.js` | AES-256-GCM encryption and decryption helpers. |
| `server/src/utils/constants.js`, `logger.js` | Empty utility placeholders. |
| `server/test-socket.js`, `test-user1.js`, `test-user2.js` | Manual socket clients with embedded test values that need updating. |
| `server/scripts/resume-benchmark.js` | Integration load checks using temporary MongoDB and Redis data. |
| `server/scripts/RESUME-BENCHMARK.md` | Benchmark requirements, commands, and result interpretation. |
| `server/benchmark-results/` | Generated benchmark reports and logs; ignored by Git. |

## Installation & Setup

1. Install Node.js and npm, and provision MongoDB plus a TLS-enabled Redis instance. The benchmark requires Node.js 18 or newer; the application does not declare a Node engine version.
2. Open a terminal in the repository root and install backend dependencies:

   ```powershell
   cd server
   npm install
   ```

3. Create `server/.env` and `client/.env` using the examples in **Configuration**.
4. Start the backend from `server/`:

   ```powershell
   npm start
   ```

5. In a second terminal, starting at the repository root, install and start the frontend:

   ```powershell
   cd client
   npm install
   npm start
   ```

6. Open [the local app](http://localhost:3000). The backend listens on port `5000` by default; [the health endpoint](http://localhost:5000/health) returns `{"status":"OK"}` when the HTTP server is responding. It does not verify database health.
7. Register two accounts using separate browser profiles, add the other account by email, and open a conversation. Starting a new conversation sends an initial greeting; select the contact again after the chat list refreshes if needed.

For a frontend production build, run `npm run build` inside `client/`. Output goes to `client/build/`.

The backend's `npm run dev` script uses `nodemon`, which is not declared in its dependencies. Use `npm start` unless nodemon is separately available.

For optional integration checks, run `npm run benchmark` inside `server/` after reading [the benchmark guide](server/scripts/RESUME-BENCHMARK.md). It starts its own server and generates real database/cache traffic using temporary data. The backend `npm test` command is currently a placeholder, not a test suite.

## Configuration

Create `server/.env`:

```dotenv
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chat_app
REDIS_URL=rediss://default:YOUR_REDIS_PASSWORD@YOUR_REDIS_HOST:YOUR_REDIS_PORT
JWT_SECRET=REPLACE_WITH_A_RANDOM_SECRET
ENCRYPTION_KEY=REPLACE_WITH_64_HEXADECIMAL_CHARACTERS
```

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP and Socket.IO port; defaults to `5000`. |
| `MONGO_URI` | MongoDB connection string. |
| `REDIS_URL` | Redis connection URL. The current client explicitly enables TLS. |
| `JWT_SECRET` | Signing secret for authentication tokens. |
| `ENCRYPTION_KEY` | Exactly 32 bytes encoded as 64 hexadecimal characters. |

Generate a random value with Node.js; run it separately for each secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep the encryption key stable to read previously stored messages. Environment files are ignored by Git. The current Redis configuration expects TLS, so a default non-TLS local Redis server will require a configuration change in `server/src/config/redis.js`.

Create `client/.env`:

```dotenv
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

The API URL includes `/api`; the socket URL points to the server origin. Restart the React development server after changing these values. Frontend environment variables are included in the browser build and must not contain server secrets.

Socket.IO currently permits `http://localhost:3000` and `https://omkar-chat-app.vercel.app`. For another frontend origin, update `server/src/config/socket.js`. Express HTTP CORS is currently unrestricted. Use HTTPS for deployed client/server traffic.

## How It Works

1. Registration hashes the password with bcrypt and saves the user in MongoDB.
2. Login verifies the password, creates a JWT valid for seven days, and stores its issue timestamp in Redis with the same lifetime.
3. The client stores login data in browser storage. HTTP requests attach the token as a bearer token, and Socket.IO passes it in the connection authentication payload.
4. The server verifies the JWT and compares its timestamp with the Redis session. On a new authenticated socket connection, earlier sockets for that user are disconnected.
5. Redis tracks connected users. Socket events send the initial online-user list and subsequent presence changes.
6. A `send_message` event passes through a per-user limit of 30 messages per 60 seconds. The server finds or creates the direct conversation, encrypts the content, and saves the message in MongoDB.
7. If the recipient is online, the server emits `receive_message` to the recipient and echoes it to the sender. Messages for offline recipients remain stored and can be retrieved through history; the current implementation does not echo those sends to the sender immediately.
8. Opening an existing conversation requests its messages through HTTP. The server decrypts the stored content before returning it.

| HTTP endpoint | Purpose |
| --- | --- |
| `POST /api/auth/register` | Create an account with `username`, `email`, and `password`. |
| `POST /api/auth/login` | Sign in with `email` and `password`. |
| `GET /api/users`, `GET /api/users/contacts` | Retrieve the authenticated user's contacts. |
| `POST /api/users/add` | Add a registered contact using `email`. |
| `GET /api/chat` | Retrieve the authenticated user's conversations. |
| `GET /api/chat/:chatId/messages` | Retrieve message history for a chat ID. |
| `GET /health` | Check HTTP server responsiveness. |

User and chat endpoints require a bearer token. The global HTTP limiter is configured for 100 requests per 15 minutes per IP. Authentication routes also apply an auth limiter configured for 100 requests per 15 minutes; both currently use the default Redis key prefix.

## Challenges & Solutions

| Challenge | Current approach |
| --- | --- |
| Delivering messages without repeatedly fetching data | Socket.IO events carry live messages and presence updates. |
| Preserving conversation history | MongoDB stores conversations and messages with timestamps. |
| Avoiding plaintext message storage | AES-256-GCM encrypts content before persistence. |
| Tracking active users and replaced sessions | Redis stores socket mappings and login timestamps. |
| Controlling request volume | Redis-backed counters limit HTTP requests and socket sends. |
| Measuring behavior under load | The benchmark checks delivery, latency, authentication, presence, and encrypted storage. |

Known limitations in the current implementation:

- **Delivery status:** `createMessage()` returns a plain object, but the socket handler calls `message.save()` after emitting it. This fails, so the intended `delivered` status is not persisted.
- **Logout consistency:** login writes to both `sessionStorage` and `localStorage`, while logout and forced logout clear only local storage. Session storage can retain authentication state.
- **History authorization:** the message-history route authenticates the request but does not currently check that the requesting user belongs to the specified conversation.
- **Incomplete socket events:** typing and seen-event names exist, but their handlers are not implemented.
- **Scaling and reliability:** presence updates use read/write operations, and socket routing is local to one server. Multiple server instances require additional coordination.

## Future Enhancements

- Fix delivery-status persistence and add reliable acknowledgements, read receipts, and offline-send feedback.
- Unify browser authentication storage and fully clear state on logout.
- Add conversation membership checks, stronger input validation, and consistent response filtering.
- Implement typing indicators, unread counts, and notifications.
- Add message pagination, search, attachments, and group conversations.
- Add a Socket.IO Redis adapter and more robust presence updates for multiple servers.
- Expand automated tests and replace manual scripts' embedded credentials with configuration.
- Improve centralized error handling and logging, and separate Redis prefixes for HTTP limiters.

## License

The backend package declares `ISC` in `server/package.json`. A repository-level `LICENSE` file has not yet been added, and the frontend package does not declare a license.

## Author

**Omkar M Shewalkar**
