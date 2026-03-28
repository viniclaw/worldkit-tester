import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { payload, action, signal } = await req.json();

  const app_id = process.env.WORLDCOIN_APP_ID || "app_staging_test";

  // In v2.0, verifyCloudProof may need different import path
  // For now, forward to World's verification API directly
  try {
    const verifyRes = await fetch(`https://developer.worldcoin.org/api/v4/verify/${app_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proof: payload.proof,
        merkle_root: payload.merkle_root,
        nullifier_hash: payload.nullifier_hash,
        verification_level: payload.verification_level,
        action,
        signal: signal || "",
      }),
    });
    const result = await verifyRes.json();
    
    if (verifyRes.ok) {
      return NextResponse.json({ status: 200, result });
    } else {
      return NextResponse.json({ status: 400, result });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
