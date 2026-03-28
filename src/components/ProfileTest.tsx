"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function ProfileTest({ addLog }: { addLog: (msg: string) => void }) {
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");

  const showProfile = () => {
    if (!MiniKit.isInstalled()) {
      addLog("❌ MiniKit not installed");
      return;
    }

    const params: any = {};
    if (username) params.username = username;
    if (address) params.walletAddress = address;

    if (!username && !address) {
      addLog("Need username or address");
      return;
    }

    addLog(`Showing profile card for ${username || address}...`);
    MiniKit.showProfileCard(params);
  };

  return (
    <section className="bg-gray-900 rounded-xl p-4 space-y-3">
      <h2 className="font-semibold text-lg">👤 Profile Card</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full bg-gray-800 rounded-lg p-2 text-sm"
        placeholder="Username (e.g. andy)"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full bg-gray-800 rounded-lg p-2 text-sm font-mono text-xs"
        placeholder="Wallet address (0x...)"
      />
      <button onClick={showProfile} className="btn">Show Profile</button>
    </section>
  );
}
