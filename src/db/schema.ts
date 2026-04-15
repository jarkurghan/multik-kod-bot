import { pgTable, integer, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { USER_STATUS } from "@/utils/constants";
import { serial } from "drizzle-orm/pg-core";

export const mbu = pgTable("user", {
    id: serial("id").primaryKey(),
    tg_id: varchar("tg_id", { length: 255 }).notNull().unique(),
    first_name: text("first_name"),
    last_name: text("last_name"),
    username: text("username"),
    referred_by: integer("referred_by"),
    today_count: integer("today_count").default(0).notNull(),
    total_count: integer("total_count").default(0).notNull(),
    status: text("status", { enum: USER_STATUS }).default("active").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});

export const movie = pgTable("movie", {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    posts: text("posts").notNull(),
    description: text("description"),
    today_count: integer("today_count").default(0).notNull(),
    total_count: integer("total_count").default(0).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});
