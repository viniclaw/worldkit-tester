import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const cookieStore = await cookies();
  cookieStore.set("siwe", nonce, { secure: true });
  return NextResponse.json({ nonce });
}
