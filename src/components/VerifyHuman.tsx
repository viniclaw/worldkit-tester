"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function VerifyHuman({ addLog }: { addLog: (msg: string) => void }) {
  const [attested, setAttested] = useState(false);

  const doAttestation = async () => {
    if (!MiniKit.isInWorldApp()) {
      addLog("❌ Not in World App");
      return;
    }

    addLog("Requesting app attestation...");
    try {
      // Generate a request hash (hex-encoded hash of some request body)
      const encoder = new TextEncoder();
      const data = encoder.encode("worldkit-tester-attestation-" + Date.now());
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const requestHash = "0x" + hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

      addLog(`Request hash: ${requestHash.slice(0, 20)}...`);

      const result = await MiniKit.attestation({ requestHash });
      const payload = result.data as any;

      if (payload.status === "error") {
        addLog(`❌ Attestation error: ${payload.error_code}`);
        return;
      }

      addLog(`✅ Attestation received!`);
      addLog(`Token: ${JSON.stringify(payload).slice(0, 80)}...`);
      setAttested(true);
    } catch (e: any) {
      addLog(`❌ Error: ${e.message}`);
    }
  };

  return (
    <section className="bg-gray-900 rounded-xl p-4 space-y-3">
      <h2 className="font-semibold text-lg">🆔 App Attestation</h2>
      <p className="text-xs text-gray-400">Verify app integrity via World App attestation token</p>
      <button onClick={doAttestation} className="btn">
        {attested ? "✅ Attested — Re-attest" : "Request Attestation"}
      </button>
    </section>
  );
}
