import type { Context, Filter } from "grammy";

import { LOG_CHANNEL_ID } from "@/utils/constants";
import { sendMovie } from "@/services/send-movie";
import { sendErrorLog } from "@/services/log";

export const search = async (ctx: Filter<Context, "message:text">) => {
    try {
        if (ctx.chat.type === "private") {
            await ctx.replyWithChatAction("typing");

            if (/^[M][\d\-_]+$/i.test(ctx.message.text)) {
                const code = ctx.message.text.toUpperCase();

                const isFound = await sendMovie(code, ctx);
                if (isFound) return;
            }

            const example = "<blockquote>Masalan, hayvonlar shahri 2 multfilm kodi - <b>M319</b></blockquote>";
            await ctx.reply("❌ Topilmadi!\nMultfilm kodi to'g'riligiga ishonchingiz komilmi :)\n\n" + example, {
                parse_mode: "HTML",
                reply_parameters: { message_id: ctx.msg.message_id },
            });
            await ctx.forwardMessage(LOG_CHANNEL_ID);
        }
    } catch (error) {
        await sendErrorLog({ ctx, event: "xabar kelganda", error });
    }
};
