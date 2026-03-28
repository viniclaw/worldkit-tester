import { NextResponse } from "next/server";

// In production, store this reference in your database
const paymentRefs = new Map<string, { createdAt: number }>();

export async function POST() {
  const id = crypto.randomUUID().replace(/-/g, "");
  paymentRefs.set(id, { createdAt: Date.now() });
  return NextResponse.json({ id });
}
