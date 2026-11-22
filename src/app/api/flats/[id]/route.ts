import { NextResponse } from "next/server";
import { db } from "@/db";
import { flats, monthlyBills } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { srNo, flatNo, memberName, areaSqft, transferDate, transferFee, entranceFee, notes } = body;

    const updated = await db
      .update(flats)
      .set({
        srNo: Number(srNo),
        flatNo: String(flatNo),
        memberName: String(memberName),
        areaSqft: Number(areaSqft),
        transferDate,
        transferFee: String(transferFee),
        entranceFee: String(entranceFee),
        notes,
      })
      .where(eq(flats.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(monthlyBills).where(eq(monthlyBills.flatId, id));
    await db.delete(flats).where(eq(flats.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
