"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function ChatTest({ addLog }: { addLog: (msg: string) => void }) {
  const [message, setMessage] = useState("Check out WorldKit Tester! 🌍");
  const [recipient, setRecipient] = useState("");

  const sendChat = async () => {
    if (!MiniKit.isInWorldApp()) {
      addLog("❌ Not in World App");
      return;
    }

    addLog("Opening chat share...");
    try {
      const result = await MiniKit.chat({
        message,
        to: recipient ? [recipient] : undefined,
      });
      const data = result.data as any;

      if (data.status === "error") {
        addLog(`❌ Chat error: ${data.error_code}`);
      } else {
        addLog(`✅ Shared to ${data.count} chats`);
      }
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`);
    }
  };

  return (
    <section className="bg-gray-900 rounded-xl p-4 space-y-3">
      <h2 className="font-semibold text-lg">💬 World Chat</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-gray-800 rounded-lg p-2 text-sm resize-none"
        rows={2}
        placeholder="Message to share"
      />
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full bg-gray-800 rounded-lg p-2 text-sm"
        placeholder="Username or address (optional)"
      />
      <button onClick={sendChat} className="btn">Share via Chat</button>
    </section>
  );
}
