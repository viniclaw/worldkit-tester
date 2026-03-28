"use client";

import { MiniKit } from "@worldcoin/minikit-js";

export default function PermissionsTest({ addLog }: { addLog: (msg: string) => void }) {
  const getPerms = async () => {
    if (!MiniKit.isInWorldApp()) {
      addLog("❌ Not in World App");
      return;
    }

    addLog("Getting permissions...");
    try {
      const result = await MiniKit.getPermissions();
      addLog(`Permissions: ${JSON.stringify(result.data)}`);
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`);
    }
  };

  const requestNotifications = async () => {
    if (!MiniKit.isInWorldApp()) {
      addLog("❌ Not in World App");
      return;
    }

    addLog("Requesting notification permission...");
    try {
      const result = await MiniKit.requestPermission({
        permission: "notifications" as any,
      });
      addLog(`Result: ${JSON.stringify(result.data)}`);
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`);
    }
  };

  return (
    <section className="bg-gray-900 rounded-xl p-4 space-y-3">
      <h2 className="font-semibold text-lg">🔔 Permissions</h2>
      <div className="flex gap-2">
        <button onClick={getPerms} className="btn">Get Permissions</button>
        <button onClick={requestNotifications} className="btn">Request Notifications</button>
      </div>
    </section>
  );
}
