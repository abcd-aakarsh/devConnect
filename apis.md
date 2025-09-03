## 🔐 Auth

POST [/api/v1/auth/signup] Register a new user.
POST [/api/v1/auth/login] Login, get JWT tokens.
POST [/api/v1/auth/logout] Logout user (invalidate refresh token).
POST [/api/v1/auth/forgot-password] Send password reset link to email.
POST [/api/v1/auth/reset-password/:token] (Reset password using the token from email).
POST [/api/v1/auth/verify-email] verify email

## 👤 User Profile

GET [/api/v1/users/me] Get logged-in user’s profile.
PATCH [/api/v1/users/me] Update profile (bio, tech stack, avatar, etc.).
GET [/api/v1/users/:id] Get a public profile by ID.
GET [/api/v1/users] Get list of all users (with filters like tech stack, location).

## 🔥 Swiping & Matching

Method Endpoint Description
POST [/connections/request/:userId] Send a connection request (like).
POST [/connections/pass/:userId] Skip a user.
POST [/connections/accept/:requestId] Accept a pending request.
POST [/connections/reject/:requestId] Reject a pending request.
GET [/user/requests/pending] Get all pending requests for logged-in user.
GET [/user/matches] Get all confirmed matches.

## Admin

GET [/api/v1/admin/users] → List all users (for moderation)
DELETE [/api/v1/admin/users/:id] → Delete abusive user

## 💬 Chat / Messaging

GET /api/v1/chats Get all chats (matches) with latest message.
GET /api/v1/chats/:matchId/messages Get all messages in a chat.
POST /api/v1/chats/:matchId/messages Send a message in a match chat.

## 📌 (Optional) Notifications

GET [/api/v1/notifications] Get notifications (likes, matches, messages).
