import { Hono } from 'hono';
import { AppEnv } from '../core/types';
import { customGiftOrders } from '../db/schema';
import { uploadToCloudinary } from '../core/cloudinary';
import { z } from 'zod';

const router = new Hono<AppEnv>();

const uploadSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  image: z.any(),
});

router.post('/', async (c) => {
  const formData = await c.req.formData();
  const description = formData.get('description')?.toString() || '';
  const file = formData.get('image') as File | null;

  // Validate request
  uploadSchema.parse({ description, image: file });

  if (!file) {
    return c.json({ error: 'Image file is required' }, 400);
  }

  // Convert File to base64 Data URI
  const arrayBuffer = await file.arrayBuffer();
  const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  const fileUri = `data:${file.type};base64,${base64String}`;

  // Process Upload
  const secureUrl = await uploadToCloudinary(fileUri, c.env);

  // Generate WhatsApp link
  const phoneNumber = c.env.WHATSAPP_NUMBER || '';
  const message = `*New Custom Gift Order*\n\n*Description:*\n${description}\n\n*Image Link:*\n${secureUrl}`;
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Save to DB
  const db = c.get('db');
  const newOrder = await db.insert(customGiftOrders).values({
    description,
    imageUrl: secureUrl,
    whatsappLink,
  }).returning().get();

  return c.json({
    success: true,
    data: newOrder,
  });
});

export default router;
