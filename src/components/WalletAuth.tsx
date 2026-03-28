"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function WalletAuth({ addLog }: { addLog: (msg: string) => void }) {
  const [user, setUser] = useState<{ address: string; username?: string } | null>(null);

  const signIn = async () => {
    if (!MiniKit.isInWorldApp()) {
      addLog("❌ Not in World App");
      return;
    }

    addLog("Fetching nonce...");
    const res = await fetch("/api/nonce");
    const { nonce } = await res.json();
    addLog(`Nonce: ${nonce.slice(0, 8)}...`);

    addLog("Requesting wallet auth...");
    try {
      const result = await MiniKit.walletAuth({
        nonce,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
        statement: "Sign in to WorldKit Tester",
      });

      const data = result.data as any;
      if (data.status === "error") {
        addLog(`❌ Wallet auth error: ${JSON.stringify(data)}`);
        return;
      }

      addLog(`✅ Signed! Address: ${data.address}`);
      setUser({ address: data.address });

      const verifyRes = await fetch("/api/verify-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: data, nonce }),
      });
      const verifyResult = await verifyRes.json();
      addLog(`SIWE verify: ${verifyResult.isValid ? "✅ Valid" : "❌ Invalid"}`);
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`);
    }
  };

  const lookupUser = async () => {
    if (!user?.address) return;
    try {
      const u = await MiniKit.getUserByAddress(user.address);
      setUser({ ...user, username: u?.username });
      addLog(`User lookup: ${u?.username || "no username"} | PFP: ${u?.profilePictureUrl ? "yes" : "no"}`);
    } catch (e: any) {
      addLog(`Lookup error: ${e.message}`);
    }
  };

  return (
    <section className="bg-gray-900 rounded-xl p-4 space-y-3">
      <h2 className="font-semibold text-lg">🔑 Wallet Auth</h2>
      <button onClick={signIn} className="btn">Sign In with World App</button>
      {user && (
        <div className="space-y-2">
          <p className="text-sm text-gray-300 break-all">
            Address: <span className="text-blue-400">{user.address}</span>
          </p>
          {user.username && <p className="text-sm text-gray-300">Username: {user.username}</p>}
          <button onClick={lookupUser} className="btn-sm">Lookup User</button>
        </div>
      )}
    </section>
  );
}
