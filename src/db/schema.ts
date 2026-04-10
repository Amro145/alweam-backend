import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// جدول المنتجات في المتجر
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  category: text('category'),
  imageUrl: text('image_url').notNull(), // رابط الصورة من Cloudinary
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// جدول معرض الأعمال السابقة
export const portfolio = sqliteTable('portfolio', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(), // رابط الصورة من Cloudinary
  completionDate: text('completion_date'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// جدول لتوثيق طلبات الهدايا الخاصة (التي أُرسلت للواتساب)
export const customGiftOrders = sqliteTable('custom_gift_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(), // رابط الصورة من Cloudinary
  whatsappLink: text('whatsapp_link').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});