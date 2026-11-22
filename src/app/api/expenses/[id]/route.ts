import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { date, description, voucherNo, cashAmount, bankAmount, category } = body;

    const updated = await db
      .update(expenses)
      .set({
        date: String(date),
        description: String(description),
        voucherNo: String(voucherNo),
        cashAmount: String(cashAmount),
        bankAmount: String(bankAmount),
        category: category || "सामान्य खर्च",
      })
      .where(eq(expenses.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(expenses).where(eq(expenses.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
