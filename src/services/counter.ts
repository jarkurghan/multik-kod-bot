import type { UserStatus } from "@/utils/types.ts";
import type { Context } from "grammy";

import { eq } from "drizzle-orm/sql/expressions/conditions";
import { saveUser } from "@/services/save-user";
import { sendErrorLog } from "@/services/log";
import { mbu, movie } from "@/db/schema";
import { db } from "@/db/client";

export const counter = async (ctx: Context, movieId?: number, step?: number) => {
    try {
        const chat = ctx.chat;
        if (!chat) return;

        const c = step || 1;

        if (chat.type === "private") {
            const tg_id = ctx.from?.id;
            if (!tg_id) return;

            const whereCondition = eq(mbu.tg_id, String(tg_id));
            const [user] = await db.select().from(mbu).where(whereCondition).limit(1);

            if (user) {
                let { total_count, today_count } = user;

                today_count += c;
                total_count += c;

                const userData = { today_count, total_count, status: "active" as UserStatus };
                await db.update(mbu).set(userData).where(whereCondition);
            } else {
                await saveUser(ctx, { today_count: c, total_count: c });
            }

            if (movieId) {
                const whereCondition2 = eq(movie.id, movieId);
                const [ep] = await db.select().from(movie).where(whereCondition2).limit(1);
                if (ep) {
                    let { total_count, today_count } = ep;
                    today_count += c;
                    total_count += c;
                    const episodeData = { today_count, total_count };
                    await db.update(movie).set(episodeData).where(whereCondition2);
                }
            }
        }
    } catch (err) {
        await sendErrorLog({ ctx, event: "counter", error: err });
    }
};
