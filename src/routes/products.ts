import { Hono } from 'hono';
import { AppEnv } from '../core/types';
import { products } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const router = new Hono<AppEnv>();

router.get('/', async (c) => {
  const db = c.get('db');
  // Only fetch active products
  const allProducts = await db.select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt))
    .all();
  return c.json({ data: allProducts });
});

router.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const db = c.get('db');
  const product = await db.select().from(products).where(eq(products.id, id)).get();
  if (!product) return c.json({ error: 'Product not found' }, 404);
  return c.json({ data: product });
});

const productSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.number().optional(),
  imageUrl: z.string().url(),
  stockQuantity: z.number().nonnegative().optional(),
  salePrice: z.number().optional(),
  sku: z.string().optional(),
});

// Create
router.post('/', zValidator('json', productSchema), async (c) => {
  const data = c.req.valid('json');
  const db = c.get('db');
  
  const newProduct = await db.insert(products).values(data).returning().get();
  return c.json({ success: true, data: newProduct }, 201);
});

// Update
const updateSchema = productSchema.partial();
router.put('/:id', zValidator('json', updateSchema), async (c) => {
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = c.get('db');
  
  const updatedProduct = await db.update(products).set(data).where(eq(products.id, id)).returning().get();
  if (!updatedProduct) return c.json({ error: 'Product not found' }, 404);
  
  return c.json({ success: true, data: updatedProduct });
});

// Soft Delete
router.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const db = c.get('db');
  
  const deletedProduct = await db.update(products).set({ isActive: false }).where(eq(products.id, id)).returning().get();
  if (!deletedProduct) return c.json({ error: 'Product not found' }, 404);
  
  return c.json({ success: true, message: 'Product archived' });
});

export default router;
