import { type Context } from "hono";
import { descToJson } from "@/utils/parser";
import { notLike } from "drizzle-orm";
import { movie } from "@/db/schema";
import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { and } from "drizzle-orm";
import { not } from "drizzle-orm";
import { ne } from "drizzle-orm";
import { gt } from "drizzle-orm";

export const mostWatchedMovies = async (c: Context) => {
    const page = Math.max(1, Number(c.req.query("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? 20)));
    const offset = (page - 1) * limit;

    const movies = await db.select().from(movie).where(notLike(movie.code, "%N%")).orderBy(desc(movie.total_count)).limit(limit).offset(offset);

    const data = movies.map((e) => ({ ...e, ...descToJson(e.description), description: undefined }));
    return c.json({ page, limit, data });
};

export const mostWatchedMoviesToday = async (c: Context) => {
    const page = Math.max(1, Number(c.req.query("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? 20)));
    const offset = (page - 1) * limit;

    const whereCondition = and(notLike(movie.code, "%N%"), gt(movie.today_count, 0));
    const movies = await db.select().from(movie).where(whereCondition).orderBy(desc(movie.today_count)).limit(limit).offset(offset);

    const data = movies.map((e) => ({ ...e, ...descToJson(e.description), description: undefined }));
    return c.json({ page, limit, data });
};

export const mostWatchedMovieToday = async (c: Context) => {
    const movies = await db.select().from(movie).where(notLike(movie.code, "%N%")).orderBy(desc(movie.today_count)).limit(1);
    const data = movies.map((e) => ({ ...e, ...descToJson(e.description), description: undefined }));
    return c.json({ page: 1, limit: 1, data });
};
