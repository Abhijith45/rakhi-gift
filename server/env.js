/**
 * Environment loader — must be the FIRST import in server/index.js
 *
 * In ESM, all `import` statements are hoisted and executed before any
 * synchronous code, so dotenv.config() called in index.js runs AFTER
 * all modules (including razorpay.js, prisma.js) have already evaluated
 * their module-level process.env reads.
 *
 * Solution: import this file first so dotenv runs at module evaluation
 * time of THIS file, before other application modules are resolved.
 *
 * NOTE: ESM import order is resolved in dependency graph order.
 * Since this file has NO imports itself, it evaluates first.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env (backend secrets — Razorpay, DB, JWT, Cloudinary)
const serverEnvResult = dotenv.config({ path: path.resolve(__dirname, '.env') });
// Load root .env as non-overriding fallback (VITE_ vars, shared config)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (serverEnvResult.error) {
  console.warn(`[ENV] Could not load server/.env: ${serverEnvResult.error.message}`);
  console.warn('[ENV] Make sure server/.env exists with required environment variables.');
} else {
  console.log('[ENV] Loaded server/.env successfully.');
}
