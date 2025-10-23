import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { folders } from "./folders";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  folderId: integer("folder_id").references(() => folders.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
