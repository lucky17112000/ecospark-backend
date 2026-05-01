# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Run with tsx watch (hot reload)

# Production
npm run build            # prisma generate && tsc && fix-imports.js
npm start                # node dist/server.js

# Stripe webhook (separate terminal)
npm run stripe:webhook   # Forward Stripe webhooks to localhost:5000/webhook
```

No test suite is configured (`test` script is a placeholder).

## Architecture

EcoSpark is an **Express.js v5 / TypeScript** REST API for an environmental innovation idea-sharing platform. It runs as ESM (`"type": "module"`), targets Node 18+, and deploys to **Vercel** (entry: `api/index.js`).

**API base URL**: `http://localhost:5000/api/v1`

### Key Technologies

| Concern | Library |
|---|---|
| ORM | Prisma 7 (PostgreSQL / Neon) |
| Auth | better-auth v1 + custom JWT |
| Validation | Zod v4 |
| Payments | Stripe v22 |
| File storage | Multer → Cloudinary |
| Email | Nodemailer + EJS templates |
| Chat | Botpress client SDK |
| Scheduling | node-cron |

### Module Structure

All feature modules live under `src/app/module/` and follow a strict MVC pattern:

```
module/{name}/
├── {name}.controller.ts   # Express handlers (thin, delegates to service)
├── {name}.service.ts      # Business logic + Prisma queries
├── {name}.route.ts        # Express Router + middleware wiring
├── {name}.validate.ts     # Zod schemas for request validation
└── {name}.interface.ts    # TypeScript types/interfaces
```

Modules: `auth`, `idea`, `category`, `feedback`, `vote`, `purchase`, `payment`, `admin`, `chat`

All routes are aggregated in `src/app/routes/index.ts` and mounted at `/api/v1`.

### Shared Utilities

- **`src/shared/catchAsync.ts`** — wraps async controllers to forward errors to the global handler
- **`src/shared/sendResponse.ts`** — standard `{ success, message, data, meta }` envelope
- **`src/app/utiles/QueryBuilder.ts`** — Prisma query builder with search, sort, and pagination
- **`src/app/midddlware/validateRequest.ts`** — Zod body validation middleware
- **`src/app/midddlware/cheakAuth.ts`** — session + JWT auth, role-based access (`cheakAuth('ADMIN')`)
- **`src/app/midddlware/globalErrorHandler.ts`** — handles AppError, Zod errors, and generic errors

### Authentication Flow

Two layers run together:

1. **better-auth** manages sessions (httpOnly cookies, 1-day expiry). It handles email/password registration, email OTP verification (6-digit, 2-min expiry), and password reset.
2. **Custom JWT** access + refresh tokens (stored in httpOnly cookies) protect the API routes.

`cheakAuth()` middleware validates the session token, checks user status (not BLOCKED/DELETED), verifies the JWT access token, and enforces roles. It sends a `X-Session-Expiry-Warning` header when the session is at <20% remaining lifetime.

### Database

Prisma schema is split into multiple files under `prisma/schema/*.prisma`. Core models: `User`, `Session`, `Account`, `Verification`, `Idea`, `Category`, `Feedback`, `Vote`, `Purchase`, `Payment`.

Key enums:
- `Role`: USER | ADMIN
- `IDEA_STATUS`: UNDER_REVIEW → APPROVED → PUBLISHED | REJECTED | ARCHIVED
- `USER_STATUS`: ACTIVE | BLOCKED | DELETED (soft delete)

### Error Handling

Throw `AppError` (from `src/app/errorHelper.ts`) with an HTTP status code. The global error handler converts Zod validation errors, Prisma errors, and `AppError` into the standard response envelope. In development it includes the full stack trace.

### Environment Variables

Required variables (see README for full list):
- `DATABASE_URL` — Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRY`, `REFRESH_TOKEN_EXPIRY`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `BOTPRESS_TOKEN`, `BOTPRESS_BOT_ID`, `BOTPRESS_WORKSPACE_ID`
- `FRONTEND_URL`

All env vars are loaded and validated in `src/app/config/env.ts` — add new ones there.

### Build Notes

The build script runs `scripts/fix-imports.js` after `tsc` to rewrite `.js` extension imports for ESM compatibility in the `dist/` output. Do not skip this step.
