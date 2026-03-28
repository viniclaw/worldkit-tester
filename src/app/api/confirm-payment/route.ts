import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  // In production: verify via Developer Portal API
  // GET https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${APP_ID}&type=payment
  
  if (payload.status === "success" && payload.transaction_id) {
    return NextResponse.json({
      success: true,
      transaction_id: payload.transaction_id,
      message: "Payment received (optimistic confirmation)",
    });
  }

  return NextResponse.json({ success: false });
}
