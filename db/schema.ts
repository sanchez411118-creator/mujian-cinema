import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const works = sqliteTable("film_works", {
 id:text("id").primaryKey(), payload:text("payload"), summary:text("summary"), sourceTime:text("source_time").notNull(),
});
export const crawlState = sqliteTable("film_crawl", {
 id:text("id").primaryKey(), lease:integer("lease").notNull(), checked:integer("checked").notNull(), cursors:text("cursors").notNull(),
});