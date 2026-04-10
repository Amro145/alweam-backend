import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// فئات المنتجات
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

// جدول المنتجات في المتجر
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  imageUrl: text('image_url').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  stockQuantity: integer('stock_quantity').default(0),
  salePrice: real('sale_price'),
  sku: text('sku').unique(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// جدول معرض الأعمال السابقة
export const portfolio = sqliteTable('portfolio', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  completionDate: text('completion_date'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// جدول لتوثيق طلبات الهدايا الخاصة
export const customGiftOrders = sqliteTable('custom_gift_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  whatsappLink: text('whatsapp_link').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});