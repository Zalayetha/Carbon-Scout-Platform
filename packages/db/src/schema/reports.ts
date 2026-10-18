import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const carbonReports = pgTable("carbon_reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  query: text("query").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  sources: jsonb("sources").$type<Array<{ title: string; url: string }>>().default([]),
  disclaimer: text("disclaimer")
    .notNull()
    .default(
      "Prices reflect voluntary carbon market benchmarks and are subject to market volatility.",
    ),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CarbonReport = typeof carbonReports.$inferSelect;
export type NewCarbonReport = typeof carbonReports.$inferInsert;
