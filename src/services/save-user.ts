import type { User } from "@/utils/types.ts";
import type { Context } from "grammy";

import { eq } from "drizzle-orm/sql/expressions/conditions";
import { sendAdmin } from "@/services/log.ts";
import { sendErrorLog } from "@/services/log.ts";
import { mbu } from "@/db/schema.ts";
import { db } from "@/db/client.ts";

export function userLink(user: User): string {
    const fullName = `${user.first_name || "Noma'lum"} ${user.last_name || ""}`;
    return user.username ? `<a href="tg://resolve?domain=${user.username}">${fullName}</a>` : `<a href="tg://user?id=${user.tg_id}">${fullName}</a>`;
}

export function groupLink(chat: { id: number; title?: string; username?: string | null }): string {
    const name = chat.title || "Noma'lum";
    return chat.username ? `<a href="https://t.me/${chat.username}">${name}</a>` : name;
}

export async function saveUser(ctx: Context, prop?: { utm?: string; today_count?: number; total_count?: number }): Promise<User[]> {
    try {
        const user = ctx.from;
        if (!user) return [];

        const userData: User = {
            tg_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name || null,
            username: user.username || null,
        };

        if (prop?.today_count) {
            userData.today_count = prop.today_count;
        }
        if (prop?.total_count) {
            userData.total_count = prop.total_count;
        }

        // to-do: referred_by qo'shish

        const tgIdKey = String(userData.tg_id);
        const [existing] = await db.select({ tg_id: mbu.tg_id }).from(mbu).where(eq(mbu.tg_id, tgIdKey)).limit(1);
        if (!existing) {
            await ctx.reply("Botga xush kelibsiz! 🎉", { reply_markup: { remove_keyboard: true } });

            const utm = prop?.utm || "Xudo biladi 🤷‍♂️";
            const username = user.username ? `@${user.username}` : "Noma'lum";
            const userlink = userLink(userData);
            const msg =
                `🆕 Yangi foydalanuvchi:\n\n👤 Ism: ${userlink}\n🔗 Username: ${username}\n` +
                `🆔 ID: <code>${user.id}</code>\n🚪 Qayerdan kelgan: ${utm}\n🤖 Bot: @uz_multfilm_bot`;
            await sendAdmin(msg);

            await ctx.reply("Assalom alaykum!\nUshbu bot @uzbek_tilida_multfilm kanalidagi kodlar asosida multfilm topib berish uchun mo'ljallangan");
        }
        await ctx.replyWithChatAction("typing");

        try {
            const insertValues = {
                tg_id: tgIdKey,
                first_name: userData.first_name,
                last_name: userData.last_name,
                username: userData.username,
                ...(userData.today_count !== undefined ? { today_count: userData.today_count } : {}),
                ...(userData.total_count !== undefined ? { total_count: userData.total_count } : {}),
            };

            const rows = await db
                .insert(mbu)
                .values(insertValues)
                .onConflictDoUpdate({
                    target: [mbu.tg_id],
                    set: { first_name: userData.first_name, last_name: userData.last_name, username: userData.username, updated_at: new Date() },
                })
                .returning();

            return rows.map(
                (row): User => ({
                    id: row.id,
                    tg_id: row.tg_id ?? tgIdKey,
                    first_name: row.first_name ?? "",
                    last_name: row.last_name,
                    username: row.username,
                }),
            );
        } catch (err) {
            await sendErrorLog({ ctx, event: "saveUser (DB)", error: err });
            return [];
        }
    } catch (err) {
        await sendErrorLog({ ctx, event: "saveUser", error: err });
        return [];
    }
}
