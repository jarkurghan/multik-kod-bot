import { type Context } from "hono";
import { descToJson } from "@/utils/parser";
import { inArray, like, notLike } from "drizzle-orm";
import { movie } from "@/db/schema";
import { desc } from "drizzle-orm";
import { db } from "@/db/client";

export const seriesList = async (c: Context) => {
    const page = Math.max(1, Number(c.req.query("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? 20)));
    const offset = (page - 1) * limit;

    const seriesall = await db.select().from(movie).where(like(movie.code, "%N%"));

    const ids = [...new Set(seriesall.map((e) => e.code.split("N")[0]))];
    const series = await db.select().from(movie).where(inArray(movie.code, ids)).orderBy(desc(movie.created_at)).limit(limit).offset(offset);

    const data = series.map((e) => ({ ...e, ...descToJson(e.description), description: undefined }));
    return c.json({ page, limit, data });
};
