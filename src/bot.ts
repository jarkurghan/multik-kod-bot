import { Bot } from "grammy";
import { BOT_TOKEN } from "@/utils/constants";
import { webhookCallback } from "grammy";
import { registerChatMember } from "@/handlers/register-chat-member";
import { errorHandler } from "@/handlers/register-error-handler";
import { botStart } from "@/handlers/register-start-command";
import { search } from "@/handlers/callback-queries";

if (!BOT_TOKEN) throw new Error("BOT_TOKEN topilmadi!");
export const bot = new Bot(BOT_TOKEN);

bot.command("start", botStart);

bot.on("message:text", search);
bot.on("my_chat_member", registerChatMember);

bot.catch(errorHandler);

export const handleUpdate = webhookCallback(bot, "hono");

// export function startBot() {
//     console.log("Bot is running...");
//     return bot.start();
// }
