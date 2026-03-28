"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { Tokens, tokenToDecimals } from "@worldcoin/minikit-js/commands";

export default function PayTest({ addLog }: { addLog: (msg: string) => void }) {
  const [token, setToken] = useState<"WLD" | "USDC">("WLD");
  const [amount, setAmount] = useState("0.1");
  const [toAddress, setToAddress] = useState("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");

  const sendPayment = async () => {
    if (!MiniKit.isInWorldApp()) {
      addLog("❌ Not in World App");
      return;
    }

    addLog("Initiating payment...");
    const res = await fetch("/api/initiate-payment", { method: "POST" });
    const { id } = await res.json();
    addLog(`Reference: ${id.slice(0, 12)}...`);

    const tokenEnum = token === "WLD" ? Tokens.WLD : Tokens.USDC;
    const payload = {
      reference: id,
      to: toAddress,
      tokens: [
        {
          symbol: tokenEnum,
          token_amount: tokenToDecimals(parseFloat(amount), tokenEnum).toString(),
        },
      ],
      description: `WorldKit Tester: ${amount} ${token}`,
    };

    addLog(`Requesting ${amount} ${token} payment...`);
    try {
      const result = await MiniKit.pay(payload);
      const data = result.data as any;

      if (data.status === "success") {
        addLog(`✅ Payment sent! TX: ${JSON.stringify(data).slice(0, 80)}...`);

        const confirmRes = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const confirmResult = await confirmRes.json();
        addLog(`Backend confirm: ${confirmResult.success ? "✅" : "⏳ Pending"}`);
      } else {
        addLog(`❌ Payment failed: ${JSON.stringify(data)}`);
      }
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`);
    }
  };

  return (
    <section className="bg-gray-900 rounded-xl p-4 space-y-3">
      <h2 className="font-semibold text-lg">💸 Pay</h2>
      <div className="flex gap-2">
        <button onClick={() => setToken("WLD")} className={`btn-sm ${token === "WLD" ? "bg-blue-600" : ""}`}>
          WLD
        </button>
        <button onClick={() => setToken("USDC")} className={`btn-sm ${token === "USDC" ? "bg-blue-600" : ""}`}>
          USDC
        </button>
      </div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full bg-gray-800 rounded-lg p-2 text-sm"
        placeholder="Amount"
        step="0.1"
        min="0.1"
      />
      <input
        type="text"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="w-full bg-gray-800 rounded-lg p-2 text-sm font-mono text-xs"
        placeholder="Recipient address"
      />
      <button onClick={sendPayment} className="btn">Send Payment</button>
    </section>
  );
}
