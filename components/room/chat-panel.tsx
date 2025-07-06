"use client";

import { EnhancedChatPanel } from "./enhanced-chat-panel";

export function ChatPanel({ roomId }: { roomId: string }) {
  return <EnhancedChatPanel roomId={roomId} />;
}
