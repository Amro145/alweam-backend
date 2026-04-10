import { Hono } from 'hono';
import { AppEnv } from '../core/types';
import { portfolio } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const router = new Hono<AppEnv>();

router.get('/', async (c) => {
  const db = c.get('db');
  const allWorks = await db.select().from(portfolio).orderBy(desc(portfolio.createdAt)).all();
  return c.json({ data: allWorks });
});

const portfolioSchema = z.object({
  title: z.string(),
  imageUrl: z.string().url(),
  completionDate: z.string().optional(),
});

router.post('/', zValidator('json', portfolioSchema), async (c) => {
  const data = c.req.valid('json');
  const db = c.get('db');
  
  const newWork = await db.insert(portfolio).values(data).returning().get();
  return c.json({ success: true, data: newWork }, 201);
});

const updatePortfolioSchema = portfolioSchema.partial();
router.put('/:id', zValidator('json', updatePortfolioSchema), async (c) => {
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = c.get('db');
  
  const updatedWork = await db.update(portfolio).set(data).where(eq(portfolio.id, id)).returning().get();
  if (!updatedWork) return c.json({ error: 'Portfolio item not found' }, 404);
  
  return c.json({ success: true, data: updatedWork });
});

router.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const db = c.get('db');
  
  const result = await db.delete(portfolio).where(eq(portfolio.id, id)).returning().get();
  if (!result) return c.json({ error: 'Portfolio item not found' }, 404);
  
  return c.json({ success: true, message: 'Deleted successfully' });
});

export default router;
