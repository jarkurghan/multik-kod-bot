import type { Context } from "grammy";

import { findUtm, objPayload } from "@/services/start-payload.ts";
import { getStartPayload } from "@/services/start-payload.ts";
import { sendMovie } from "@/services/send-movie";
import { saveUser } from "@/services/save-user";
import { sendErrorLog } from "@/services/log";
import { LOG_CHANNEL_ID } from "@/utils/constants";

export async function botStart(ctx: Context) {
    try {
        if (!ctx.from || !ctx.msg) return;

        await ctx.replyWithChatAction("typing");

        const payload = getStartPayload(ctx);
        const payloadObj = objPayload(payload);

        const utm = findUtm(payloadObj);
        const [user] = await saveUser(ctx, { utm });
        if (!user) return;

        if (payloadObj.mcode) {
            const code = payloadObj.mcode.toUpperCase();

            const isFound = await sendMovie(code, ctx);
            if (!isFound) {
                await ctx.reply("❌ Topilmadi!", { reply_parameters: { message_id: ctx.msg.message_id } });

                const forwardedLog = await ctx.forwardMessage(LOG_CHANNEL_ID);
                const reply_to_message_id = forwardedLog.message_id;
                await ctx.api.sendMessage(LOG_CHANNEL_ID, code, { reply_to_message_id });
            }
            return;
        }

        const message =
            `Multfilm kodini yozing va men sizga multfilmni yuboraman!\n\n` +
            "<blockquote>Multfilmlar kodlarini ko'rish uchun @uzbek_tilida_multfilm kanaliga o'ting</blockquote>";
        await ctx.reply(message, { parse_mode: "HTML" });
    } catch (error) {
        await sendErrorLog({ ctx, event: "bot_start", error });
    }
}
