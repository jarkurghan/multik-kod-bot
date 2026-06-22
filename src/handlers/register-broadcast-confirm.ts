import type { Context, NextFunction } from "grammy";

import { BROADCAST_CHANNEL_ID, BROADCAST_PRIVATE_CHAT_ID } from "@/utils/constants";
import { getPendingBroadcast, setPendingBroadcast } from "@/state/broadcast";
import { broadcastToAllUsers } from "@/services/broadcast";
import { sendErrorLog } from "@/services/log";
import { bot } from "@/bot";

export async function broadcastConfirm(ctx: Context, next: NextFunction) {
    try {
        if (ctx.chat?.type !== "private") return next();
        if (String(ctx.from?.id) !== BROADCAST_PRIVATE_CHAT_ID) return next();

        const text = ctx.message?.text;
        const pending = getPendingBroadcast();

        if (!pending || (text !== "Ha" && text !== "Yo'q")) return next();

        if (text === "Ha") {
            await ctx.reply("⏳ Broadcast boshlanmoqda...", { reply_markup: { remove_keyboard: true } });

            const { sent, failed } = await broadcastToAllUsers(pending.channelChatId, pending.channelMessageId);
            setPendingBroadcast(null);

            const summary =
                `✅ Broadcast yakunlandi\n\n` +
                `🎯 Yuborildi: ${sent}\n` +
                `💢 Xato: ${failed}\n` +
                `📊 Jami: ${sent + failed}`;

            await bot.api.sendMessage(BROADCAST_CHANNEL_ID, summary, { reply_parameters: { message_id: pending.channelMessageId } });
            await ctx.reply(summary);
        } else {
            setPendingBroadcast(null);
            await ctx.reply("❌ Broadcast bekor qilindi", { reply_markup: { remove_keyboard: true } });
            await bot.api.sendMessage(BROADCAST_CHANNEL_ID, "❌ Broadcast bekor qilindi", { reply_parameters: { message_id: pending.channelMessageId } });
        }
    } catch (error) {
        await sendErrorLog({ ctx, event: "broadcast_confirm", error });
    }
}
