import type { D1Database } from '@cloudflare/workers-types';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export type Bindings = {
  DB: D1Database;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  WHATSAPP_NUMBER: string;
  FRONTEND_URL: string;
  ADMIN_SECRET: string;
};

export type Variables = {
  db: DrizzleD1Database<typeof schema>;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
