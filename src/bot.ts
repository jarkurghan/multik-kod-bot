import { Bot } from "grammy";
import { Context } from "grammy";
import { webhookCallback } from "grammy";
import { USER_TABLE_NAME } from "./constants";
import { ADMIN_CHAT } from "./constants";
import { TABLE_NAME } from "./constants";
import { BOT_TOKEN } from "./constants";
import { CHANNEL } from "./constants";
import { supabase } from "./supabase";
import { User } from "./types";

if (!BOT_TOKEN) throw new Error("BOT_TOKEN topilmadi!");

export const bot = new Bot(BOT_TOKEN);

async function saveUser(ctx: Context, prop: { utm?: string }) {
    try {
        const user = ctx.from;
        if (!user) return [];

        const userData: User = { tg_id: user.id, first_name: user.first_name, last_name: user.last_name || null, username: user.username || null };
        const { data } = await supabase.from(USER_TABLE_NAME).select("tg_id").eq("tg_id", userData.tg_id).maybeSingle();
        if (!data) {
            const utm = prop.utm || "-";
            const message =
                `🆕 Yangi foydalanuvchi:\n\n👤 Ism: ${user.first_name || "Noma'lum"} ${user.last_name || ""}\n🔗 Username:` +
                ` ${user.username ? `@${user.username}` : "Noma'lum"}\n🆔 ID: ${user.id}\n🚪 UTM: ${utm}\n🤖 Bot: @uz_multfilm_bot`;
            await bot.api.sendMessage(ADMIN_CHAT, message);

            await ctx.reply("Assalom alaykum!\nUshbu bot @uzbek_tilida_multfilm kanalidagi kodlar asosida multfilm topib berish uchun mo'ljallangan");
        }
        await ctx.replyWithChatAction("typing");

        const { error } = await supabase.from(USER_TABLE_NAME).upsert(userData, { onConflict: "tg_id" }).select("*");
        if (error) console.error("Supabasega saqlashda xato:", error);
    } catch (err) {
        console.error(err);
    }
}

const sendMovie = async (code: string, ctx: Context) => {
    try {
        const chat = ctx.chat?.id ?? ctx.message?.chat?.id ?? ctx.from?.id;
        if (!chat) return false;

        const { data: movie } = await supabase.from(TABLE_NAME).select("*").eq("code", code).maybeSingle();
        if (!movie) return false;

        await ctx.replyWithChatAction("upload_video");

        const posts = movie.posts.split(",");
        for (let i = 0; i < posts.length; i++) {
            await ctx.api.copyMessage(chat, CHANNEL, posts[i]);
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

bot.command("start", async (ctx) => {
    try {
        await ctx.replyWithChatAction("typing");

        const payload = ctx.match;
        const utm = payload.includes("mcode") ? "channel" : payload.includes("utm-") ? payload.slice(payload.indexOf("utm-") + 4) : "";
        await saveUser(ctx, { utm });

        if (payload && payload.slice(0, 5).toLowerCase() === "mcode") {
            const code = payload.slice(6);

            const isFound = await sendMovie(code, ctx);
            if (!isFound) await ctx.reply("❌ Topilmadi!", { reply_parameters: { message_id: ctx.msg.message_id } });
            return;
        }

        const message =
            `Multfilm kodini yozing va men sizga multfilmni yuboraman!\n\n` +
            "<blockquote>Multfilmlar kodlarini ko'rish uchun @uzbek_tilida_multfilm kanaliga o'ting</blockquote>";
        await ctx.reply(message, { parse_mode: "HTML" });
    } catch (error) {
        console.log(error);
    }
});

bot.on("message:text", async (ctx) => {
    try {
        if (ctx.chat.type === "private") {
            await ctx.replyWithChatAction("typing");

            if (/^[M][\d\-_]+$/i.test(ctx.message.text)) {
                const code = ctx.message.text.toUpperCase();

                const isFound = await sendMovie(code, ctx);
                if (isFound) return;
            }
            await ctx.reply("❌ Topilmadi!\nMultfilm kodi to'g'riligiga ishonchingiz komilmi :)", { reply_parameters: { message_id: ctx.msg.message_id } });
        }
    } catch (error) {
        console.log(error);
    }
});

export const handleUpdate = webhookCallback(bot, "hono");
