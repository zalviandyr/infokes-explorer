import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";

export const folders = pgTable(
  "folders",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    parentId: integer("parent_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }),
  ],
);
