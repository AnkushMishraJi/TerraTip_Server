# TerraTip_Server

This is the backend server for TerraTip Web App

# TerraTip Server Development Guidelines

## Overview
This backend server powers the TerraTip investment app. It is built with Node.js, Express, MongoDB (Mongoose), and uses Firebase for phone-based authentication. The codebase is structured for scalability, maintainability, and security, following best practices for modern backend development.

## Key Technologies
- Node.js & Express
- MongoDB with Mongoose
- Firebase Admin SDK (for phone/OTP authentication)
- JWT (JSON Web Tokens) for session management
- HTTP-only cookies for authentication
- Joi for request validation
- Centralized error handling

## Project Structure
- `/controllers` — Only handles request/response, delegates business logic to services
- `/services` — Contains all business logic
- `/middlewares` —
  - `auth.js`: JWT authentication middleware
  - `validation.js`: Joi-based request validation
- `/models` — Mongoose models
- `/routes` — Route definitions
- `/utils` — Utility functions (e.g., catchAsync)
- `/config` — Configuration files (Firebase, Mongoose, etc.)

## Development Rules
1. **Controllers** must not contain business logic. They only handle request/response and call service layer functions. All controller functions should be wrapped with `catchAsync` for error handling.
2. **Service Layer** contains all business logic and database interaction.
3. **Validation** of request parameters must be done in middleware using Joi schemas before reaching the controller.
4. **Authentication** is handled using Firebase phone/OTP and JWTs stored in HTTP-only cookies.
5. **Error Handling** is centralized. Use the `catchAsync` utility to wrap all async controller functions.
6. **No direct database or business logic in routes or controllers.**
7. **All new features and changes must be reflected in this README and reviewed by Copilot before implementation.**

## Authentication Flow
- Client requests OTP (handled by Firebase client SDK)
- Client submits phone and Firebase ID token
- Server verifies ID token, finds/creates user, issues JWT in HTTP-only cookie
- All protected routes require valid JWT in cookie

## Contribution
- Follow the above rules for all new code.
- Update this README with any new patterns, rules, or major changes.
- Use Prettier and ESLint for code formatting and linting.

---
**Always review this README with Copilot before making changes to ensure consistency and best practices.**
