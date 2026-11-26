CREATE TABLE `tenants` (
	`user_id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`db_name` text NOT NULL,
	`db_id` text,
	`db_url` text,
	`auth_token_enc` text,
	`status` text NOT NULL,
	`error` text,
	`schema_version` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
