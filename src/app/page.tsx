"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import WalletAuth from "@/components/WalletAuth";
import VerifyHuman from "@/components/VerifyHuman";
import PayTest from "@/components/PayTest";
import ChatTest from "@/components/ChatTest";
import PermissionsTest from "@/components/PermissionsTest";
import ProfileTest from "@/components/ProfileTest";

export default function Home() {
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const checkInstalled = () => {
    const isWorld = MiniKit.isInWorldApp();
    setInstalled(isWorld);
    addLog(`MiniKit.isInWorldApp() → ${isWorld}`);
  };

  const handleClose = () => {
    if (!MiniKit.isInWorldApp()) {
      addLog("Not in World App — can't close");
      return;
    }
    addLog("Closing mini app...");
    MiniKit.closeMiniApp();
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold">🌍 WorldKit Tester</h1>
        <p className="text-gray-400 text-sm">Test every MiniKit command</p>
      </header>

      {/* Status */}
      <section className="bg-gray-900 rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-lg">Status</h2>
        <div className="flex gap-2">
          <button onClick={checkInstalled} className="btn">
            Check MiniKit
          </button>
          <button onClick={handleClose} className="btn btn-red">
            Close App
          </button>
        </div>
        {installed !== null && (
          <p className={installed ? "text-green-400" : "text-red-400"}>
            {installed ? "✅ Running in World App" : "❌ Not in World App (browser mode)"}
          </p>
        )}
      </section>

      <WalletAuth addLog={addLog} />
      <VerifyHuman addLog={addLog} />
      <PayTest addLog={addLog} />
      <ChatTest addLog={addLog} />
      <PermissionsTest addLog={addLog} />
      <ProfileTest addLog={addLog} />

      {/* Log */}
      <section className="bg-gray-900 rounded-xl p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">📋 Log</h2>
          <button onClick={() => setLogs([])} className="text-xs text-gray-500 hover:text-white">
            Clear
          </button>
        </div>
        <div className="bg-black rounded-lg p-3 max-h-60 overflow-y-auto font-mono text-xs space-y-1">
          {logs.length === 0 && <p className="text-gray-600">No logs yet...</p>}
          {logs.map((log, i) => (
            <p key={i} className="text-green-300">{log}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
