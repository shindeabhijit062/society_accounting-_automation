import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/index";
import { flats } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

async function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload: any = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
  if (!payload || payload.role !== "admin") throw new Error("Forbidden");
  return payload;
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const id = body.id || `flat-${uuidv4()}`;
    await db.insert(flats).values({
      id,
      srNo: body.srNo || 0,
      flatNo: body.flatNo || "",
      memberName: body.memberName || "",
      areaSqft: body.areaSqft || 225,
      transferDate: body.transferDate || null,
      transferFee: body.transferFee || "0",
      entranceFee: body.entranceFee || "0",
      notes: body.notes || null,
    });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const id = body.id;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.update(flats).set({
      srNo: body.srNo,
      flatNo: body.flatNo,
      memberName: body.memberName,
      areaSqft: body.areaSqft,
      transferDate: body.transferDate,
      transferFee: body.transferFee,
      entranceFee: body.entranceFee,
      notes: body.notes,
    }).where(eq(flats.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
