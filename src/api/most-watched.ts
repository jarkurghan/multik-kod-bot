import { type Context } from "hono";
import { notLike } from "drizzle-orm";
import { movie } from "@/db/schema";
import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { descToJson } from "@/utils/parser";

export const mostWatchedMovies = async (c: Context) => {
    const page = Math.max(1, Number(c.req.query("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? 20)));
    const offset = (page - 1) * limit;

    const movies = await db.select().from(movie).where(notLike(movie.code, "%N%")).orderBy(desc(movie.total_count)).limit(limit).offset(offset);

    const data = movies.map((e) => ({ ...e, ...descToJson(e.description), description: undefined }));
    return c.json({ page, limit, data });
};
