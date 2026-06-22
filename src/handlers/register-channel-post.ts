import type { Context, Filter } from "grammy";

import { bot } from "@/bot";
import { BROADCAST_CHANNEL_ID, BROADCAST_PRIVATE_CHAT_ID } from "@/utils/constants";
import { setPendingBroadcast } from "@/state/broadcast";
import { sendErrorLog } from "@/services/log";

export async function channelPost(ctx: Filter<Context, "channel_post">) {
    try {
        if (String(ctx.chat.id) !== BROADCAST_CHANNEL_ID) return;

        const messageId = ctx.channelPost.message_id;
        const chatId = String(ctx.chat.id);

        const copied = await bot.api.copyMessage(BROADCAST_PRIVATE_CHAT_ID, chatId, messageId, { reply_markup: ctx.channelPost.reply_markup });

        await bot.api.sendMessage(BROADCAST_PRIVATE_CHAT_ID, "📢 Bu reklamani barcha foydalanuvchilarga broadcast qilaymi?", {
            reply_parameters: { message_id: copied.message_id },
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "✅ Ha", callback_data: "broadcast:ha" },
                        { text: "❌ Yo'q", callback_data: "broadcast:yoq" },
                    ],
                ],
            },
        });

        setPendingBroadcast({ channelMessageId: messageId, channelChatId: chatId, replyMarkup: ctx.channelPost.reply_markup });
    } catch (error) {
        await sendErrorLog({ event: "channel_post", error });
    }
}
