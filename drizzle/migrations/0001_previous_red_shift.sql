CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
ALTER TABLE `products` ADD `category_id` integer REFERENCES categories(id);--> statement-breakpoint
ALTER TABLE `products` ADD `is_active` integer DEFAULT true;--> statement-breakpoint
ALTER TABLE `products` ADD `stock_quantity` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `products` ADD `sale_price` real;--> statement-breakpoint
ALTER TABLE `products` ADD `sku` text;--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);