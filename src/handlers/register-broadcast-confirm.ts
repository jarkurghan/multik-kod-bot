import type { Context, Filter, NextFunction } from "grammy";

import { bot } from "@/bot";
import { BROADCAST_CHANNEL_ID, BROADCAST_PRIVATE_CHAT_ID } from "@/utils/constants";
import { getPendingBroadcast, setPendingBroadcast } from "@/state/broadcast";
import { broadcastToAllUsers } from "@/services/broadcast";
import { sendErrorLog } from "@/services/log";

export async function broadcastConfirm(ctx: Filter<Context, "callback_query:data">, next: NextFunction) {
    try {
        if (!ctx.callbackQuery.data.startsWith("broadcast:")) return next();

        if (String(ctx.from.id) !== BROADCAST_PRIVATE_CHAT_ID) {
            await ctx.answerCallbackQuery("Sizga ruxsat yo'q");
            return;
        }

        const pending = getPendingBroadcast();
        if (!pending) {
            await ctx.answerCallbackQuery("Aktiv broadcast topilmadi");
            return;
        }

        const action = ctx.callbackQuery.data.split(":")[1];

        if (action === "ha") {
            await ctx.answerCallbackQuery("Broadcast boshlanmoqda...");
            await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: [] } });

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
            await ctx.answerCallbackQuery("Bekor qilindi");
            await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: [] } });

            setPendingBroadcast(null);
            await bot.api.sendMessage(BROADCAST_CHANNEL_ID, "❌ Broadcast bekor qilindi", { reply_parameters: { message_id: pending.channelMessageId } });
        }
    } catch (error) {
        await sendErrorLog({ ctx, event: "broadcast_confirm", error });
    }
}
