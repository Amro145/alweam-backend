import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { AppEnv } from '../core/types';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const router = new Hono<AppEnv>();

// دالة بسيطة لتشفير كلمة المرور مع ملح (Salt)
async function hashPassword(password: string, salt: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const authSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

// إنشاء حساب جديد
router.post('/signup', zValidator('json', authSchema), async (c) => {
  const { username, password } = c.req.valid('json');
  const db = c.get('db');

  // التحقق من وجود المستخدم
  const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
  if (existingUser) {
    return c.json({ success: false, message: 'اسم المستخدم موجود مسبقاً' }, 400);
  }

  const hashedPassword = await hashPassword(password, c.env.JWT_SECRET);
  
  await db.insert(users).values({
    username,
    password: hashedPassword,
  }).run();

  return c.json({ success: true, message: 'تم إنشاء الحساب بنجاح' }, 201);
});

// تسجيل الدخول
router.post('/login', zValidator('json', authSchema), async (c) => {
  const { username, password } = c.req.valid('json');
  const db = c.get('db');

  const user = await db.select().from(users).where(eq(users.username, username)).get();
  if (!user) {
    return c.json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, 401);
  }

  const hashedPassword = await hashPassword(password, c.env.JWT_SECRET);
  if (user.password !== hashedPassword) {
    return c.json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, 401);
  }

  const payload = {
    sub: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  };

  const secret = c.env.JWT_SECRET;
  const token = await sign(payload, secret);

  return c.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username
    }
  });
});

export default router;
