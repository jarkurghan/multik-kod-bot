type PendingBroadcast = { channelMessageId: number; channelChatId: string } | null;

let pendingBroadcast: PendingBroadcast = null;

export function getPendingBroadcast() {
    return pendingBroadcast;
}

export function setPendingBroadcast(data: PendingBroadcast) {
    pendingBroadcast = data;
}
