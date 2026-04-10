import { Hono } from 'hono';
import { AppEnv } from '../core/types';
import { products, portfolio } from '../db/schema';
import { bearerAuth } from 'hono/bearer-auth';
import { z } from 'zod';

const router = new Hono<AppEnv>();

// Protected routes middleware
router.use('/*', async (c, next) => {
  const auth = bearerAuth({ token: c.env.ADMIN_SECRET });
  return auth(c, next);
});

const productSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().optional(),
  imageUrl: z.string().url(),
});

router.post('/products', async (c) => {
  const body = await c.req.json();
  const data = productSchema.parse(body);

  const db = c.get('db');
  const newProduct = await db.insert(products).values(data).returning().get();

  return c.json({ success: true, data: newProduct }, 201);
});

const portfolioSchema = z.object({
  title: z.string(),
  imageUrl: z.string().url(),
  completionDate: z.string().optional(),
});

router.post('/portfolio', async (c) => {
  const body = await c.req.json();
  const data = portfolioSchema.parse(body);

  const db = c.get('db');
  const newWork = await db.insert(portfolio).values(data).returning().get();

  return c.json({ success: true, data: newWork }, 201);
});

export default router;
