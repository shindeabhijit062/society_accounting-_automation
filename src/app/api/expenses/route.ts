import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET(req: Request) {
  try {
    await seedDatabase();
    const { searchParams } = new URL(req.url);
    const monthIndex = searchParams.get("monthIndex");

    if (monthIndex) {
      const list = await db
        .select()
        .from(expenses)
        .where(eq(expenses.monthIndex, Number(monthIndex)))
        .orderBy(asc(expenses.voucherNo));
      return NextResponse.json(list);
    }

    const allExpenses = await db
      .select()
      .from(expenses)
      .orderBy(asc(expenses.monthIndex), asc(expenses.voucherNo));

    return NextResponse.json(allExpenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { financialYear, monthIndex, monthName, date, description, voucherNo, cashAmount, bankAmount, category } = body;

    const newId = `exp-${Date.now()}`;
    const inserted = await db
      .insert(expenses)
      .values({
        id: newId,
        financialYear: financialYear || "२०२५ - २०२६",
        monthIndex: Number(monthIndex) || 1,
        monthName: monthName || "एप्रिल २०२५ खर्च",
        date: String(date),
        description: String(description),
        voucherNo: String(voucherNo || "०१"),
        cashAmount: String(cashAmount || 0),
        bankAmount: String(bankAmount || 0),
        category: category || "सामान्य खर्च",
      })
      .returning();

    return NextResponse.json(inserted[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
