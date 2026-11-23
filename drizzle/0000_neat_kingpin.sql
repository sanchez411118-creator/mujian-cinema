CREATE TABLE `film_crawl` (
	`id` text PRIMARY KEY NOT NULL,
	`lease` integer NOT NULL,
	`checked` integer NOT NULL,
	`cursors` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `film_works` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text,
	`summary` text,
	`source_time` text NOT NULL
);
