import type { Context } from "grammy";

import { db } from "@/db/client";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { counter } from "@/services/counter";
import { CHANNEL } from "@/utils/constants";
import { movie } from "@/db/schema";

export const sendMovie = async (code: string, ctx: Context) => {
    try {
        const chat = ctx.chat?.id ?? ctx.message?.chat?.id ?? ctx.from?.id;
        if (!chat) return false;

        const [data] = await db.select().from(movie).where(eq(movie.code, code)).limit(1);
        if (!data) return false;

        await ctx.replyWithChatAction("upload_video");

        const posts = data.posts.split(",");
        for (let i = 0; i < posts.length; i++) {
            await ctx.api.copyMessage(chat, CHANNEL, Number(posts[i]));
        }
        await counter(ctx, data.id, posts.length);

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};
