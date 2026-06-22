import type { InlineKeyboardMarkup } from "grammy/types";

type PendingBroadcast = {
    channelMessageId: number;
    channelChatId: string;
    replyMarkup?: InlineKeyboardMarkup;
} | null;

let pendingBroadcast: PendingBroadcast = null;

export function getPendingBroadcast() {
    return pendingBroadcast;
}

export function setPendingBroadcast(data: PendingBroadcast) {
    pendingBroadcast = data;
}
