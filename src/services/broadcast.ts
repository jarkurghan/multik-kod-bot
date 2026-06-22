import { bot } from "@/bot";
import { sendLog } from "./log";
import { GrammyError } from "grammy";
import { changeStatus2 } from "./deactivator";
import { userLink } from "./save-user";
import { User } from "@/utils/types";
import { mbu } from "@/db/schema";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";

export const broadcastToAllUsers = async (fromChatId: string | number, messageId: number, replyMarkup?: import("grammy/types").InlineKeyboardMarkup) => {
    const allUsers = await db.select().from(mbu).where(eq(mbu.status, "active"));

    let sent = 0;
    let failed = 0;

    for (const user of allUsers) {
        try {
            await bot.api.copyMessage(user.tg_id, fromChatId, messageId, { reply_markup: replyMarkup });
            sent++;
        } catch (error) {
            failed++;
            const { first_name, last_name, tg_id, username } = user;
            const u: User = { first_name: first_name || "", last_name, tg_id, username };

            if (error instanceof GrammyError) {
                const description = error.description || "";

                if (description.includes("bot was blocked by the user")) {
                    await sendLog(`Foydalanuvchi botni bloklagan (${userLink(u)}): \n${description}`);
                    await changeStatus2(u, "has_blocked");
                } else if (description.includes("user is deactivated")) {
                    await sendLog(`O'chirilgan hisob (${userLink(u)}): \n${description}`);
                    await changeStatus2(u, "deleted_account");
                } else {
                    await sendLog(`Xabar yuborishda xatolik (${userLink(u)}): \n${description}`);
                    await changeStatus2(u, "other");
                }
            } else if (error instanceof Error) {
                await sendLog(`Xabar yuborishda xatolik (${userLink(u)}): \n${error.message}`);
            } else {
                await sendLog(`Xabar yuborishda xatolik (${userLink(u)}): \n${String(error)}`);
            }
        }
    }

    return { sent, failed };
};
