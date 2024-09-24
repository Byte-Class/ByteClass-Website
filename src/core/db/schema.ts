import {
  pgTable,
  varchar,
  text,
  pgEnum,
  bigint,
  timestamp,
  jsonb,
  date,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const user = pgTable("user", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  photo: text("image").notNull(),
  role: roleEnum("role").notNull(),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const googleInfo = pgTable("google_information", {
  user_id: varchar("user_id ")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull()
    .unique(),
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  access_token: text("access_token").notNull(),
  refresh_token: text("refresh_token").notNull(),
  scope: text("scope").notNull(),
  id_token: text("id_token").notNull(),
  token_type: text("token_type").notNull(),
  expiry_date: bigint("expiry_date", { mode: "number" }).notNull(),
});

export const session = pgTable("session", {
  user_id: varchar("user_id ")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull()
    .unique(),
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  expires: timestamp("expires", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const calendar = pgTable("calendar", {
  user_id: varchar("user_id ")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull(),
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  name: varchar("name", {
    length: 50,
  })
    .notNull()
    .unique(),
  description: varchar("description", {
    length: 200,
  }).notNull(),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const event = pgTable("event", {
  calendar_id: varchar("calendar_id")
    .references(() => calendar.id, {
      onDelete: "cascade",
    })
    .notNull()
    .unique(),
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  name: varchar("name", {
    length: 50,
  }).notNull(),
  description: varchar("description", {
    length: 200,
  }).notNull(),
  day: date("day").notNull(),
  time: jsonb("time").$type<{ start: Date; end: Date }>().notNull(),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});
