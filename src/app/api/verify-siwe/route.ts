import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySiweMessage } from "@worldcoin/minikit-js/siwe";

export async function POST(req: NextRequest) {
  const { payload, nonce } = await req.json();

  const cookieStore = await cookies();
  if (nonce !== cookieStore.get("siwe")?.value) {
    return NextResponse.json({ status: "error", isValid: false, message: "Invalid nonce" });
  }

  try {
    const validMessage = await verifySiweMessage(payload, nonce);
    return NextResponse.json({ status: "success", isValid: validMessage.isValid });
  } catch (error: any) {
    return NextResponse.json({ status: "error", isValid: false, message: error.message });
  }
}
