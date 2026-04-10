CREATE TABLE `custom_gift_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text NOT NULL,
	`image_url` text NOT NULL,
	`whatsapp_link` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `portfolio` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`image_url` text NOT NULL,
	`completion_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`category` text,
	`image_url` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
