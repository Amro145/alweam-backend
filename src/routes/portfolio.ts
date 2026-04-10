import { Hono } from 'hono';
import { AppEnv } from '../core/types';
import { portfolio } from '../db/schema';
import { desc } from 'drizzle-orm';

const router = new Hono<AppEnv>();

router.get('/', async (c) => {
  const db = c.get('db');
  const allWorks = await db.select().from(portfolio).orderBy(desc(portfolio.createdAt)).all();
  return c.json({ data: allWorks });
});

export default router;
