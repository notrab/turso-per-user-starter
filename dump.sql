PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		);
INSERT INTO __drizzle_migrations VALUES(NULL,'81de68dc0239193e3c868e9ee64d2650ef2966af710d1b559b4deb3bda96b41a',1795685055665);
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
COMMIT;
