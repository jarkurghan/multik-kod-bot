import { type Context } from "hono";
import { descToJson } from "@/utils/parser";
import { inArray, like, notLike } from "drizzle-orm";
import { movie } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { bot } from "@/bot";
import { CHANNEL } from "@/utils/constants";

export const seriesEpisodes = async (c: Context) => {
    const code = c.req.param("code").toUpperCase();

    const episodes = await db
        .select()
        .from(movie)
        .where(like(movie.code, `${code}N%`))
        .orderBy(sql`CAST(SPLIT_PART(${movie.code}, 'N', 2) AS INTEGER)`);

    const data = episodes.map((e) => ({ ...e, ...descToJson(e.description), description: undefined }));
    return c.json({ data });
};

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

export const sendMovie = async (c: Context) => {
    const code = c.req.param("code").toUpperCase();
    const chat_id = c.req.param("chat_id");

    const [data] = await db.select().from(movie).where(eq(movie.code, code)).limit(1);
    if (!data) {
        await bot.api.sendMessage(chat_id, "❌ Topilmadi!");
        return c.json({ ok: false });
    }

    const posts = data.posts.split(",");
    for (const post of posts) {
        await bot.api.copyMessage(chat_id, CHANNEL, Number(post));
    }

    return c.json({ ok: true });
};
