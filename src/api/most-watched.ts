import { type Context } from "hono";
import { movie } from "@/db/schema";
import { desc, notIlike } from "drizzle-orm";
import { db } from "@/db/client";

export const mostWatchedMovies = async (c: Context) => {
    const page = Math.max(1, Number(c.req.query("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? 20)));
    const offset = (page - 1) * limit;

    const movies = await db.select().from(movie).where(notIlike(movie.code, "n")).orderBy(desc(movie.total_count)).limit(limit).offset(offset);

    return c.json({ page, limit, data: movies });
};
