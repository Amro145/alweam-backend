import { Hono } from 'hono';
import { AppEnv } from '../core/types';
import { customGiftOrders } from '../db/schema';
import { generateCloudinarySignature } from '../core/cloudinary';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const router = new Hono<AppEnv>();

router.get('/signature', async (c) => {
  const { signature, timestamp } = await generateCloudinarySignature(c.env.CLOUDINARY_API_SECRET);
  return c.json({
    signature,
    timestamp,
    cloudName: c.env.CLOUDINARY_CLOUD_NAME,
    apiKey: c.env.CLOUDINARY_API_KEY
  });
});

const orderSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('A valid securely hosted image URL is required'),
});

router.post('/gift-order', zValidator('json', orderSchema), async (c) => {
  const { description, imageUrl } = c.req.valid('json');

  const phoneNumber = c.env.WHATSAPP_NUMBER || '';
  const message = `*New Custom Gift Order*\n\n*Description:*\n${description}\n\n*Image Link:*\n${imageUrl}`;
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const db = c.get('db');
  const newOrder = await db.insert(customGiftOrders).values({
    description,
    imageUrl,
    whatsappLink,
  }).returning().get();

  return c.json({
    success: true,
    data: newOrder,
  }, 201);
});

export default router;
