import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// This is useful for standalone scripts like seeding
const dbPath = process.argv[2] ? `file:${process.argv[2]}` : (process.env.DATABASE_URL || 'file:local.db');

export const db = drizzle(createClient({ 
  url: dbPath 
}), { schema });
