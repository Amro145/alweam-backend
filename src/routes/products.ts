import { Hono } from 'hono';
import { AppEnv } from '../core/types';
import { products } from '../db/schema';
import { desc } from 'drizzle-orm';

const router = new Hono<AppEnv>();

router.get('/', async (c) => {
  const db = c.get('db');
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt)).all();
  return c.json({ data: allProducts });
});

export default router;
