import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const user = pgTable("user", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image").notNull(),
});
