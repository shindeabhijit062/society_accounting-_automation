import { NextResponse } from "next/server";
import { db } from "@/db";
import { cashBankReconciliations, expenses, monthlyBills } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET(req: Request) {
  try {
    await seedDatabase();
    const { searchParams } = new URL(req.url);
    const monthIndex = searchParams.get("monthIndex") || "1";

    const recon = await db
      .select()
      .from(cashBankReconciliations)
      .where(eq(cashBankReconciliations.monthIndex, Number(monthIndex)))
      .limit(1);

    if (recon.length > 0) {
      return NextResponse.json(recon[0]);
    }

    // Default response if not exists
    return NextResponse.json({
      id: `recon-${monthIndex}`,
      financialYear: "२०२५ - २०२६",
      monthIndex: Number(monthIndex),
      monthName: "मासिक जुळवणी",
      openingCash: "0",
      openingBank: "0",
      monthlyIncomeCash: "0",
      monthlyIncomeBank: "0",
      cashDepositedToBank: "0",
      bankWithdrawnToCash: "0",
      closingCash: "0",
      closingBank: "0",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      monthIndex,
      monthName,
      openingCash,
      openingBank,
      monthlyIncomeCash,
      monthlyIncomeBank,
      cashDepositedToBank,
      bankWithdrawnToCash,
      closingCash,
      closingBank,
    } = body;

    const existing = await db
      .select()
      .from(cashBankReconciliations)
      .where(eq(cashBankReconciliations.monthIndex, Number(monthIndex)))
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(cashBankReconciliations)
        .set({
          monthName,
          openingCash: String(openingCash),
          openingBank: String(openingBank),
          monthlyIncomeCash: String(monthlyIncomeCash),
          monthlyIncomeBank: String(monthlyIncomeBank),
          cashDepositedToBank: String(cashDepositedToBank),
          bankWithdrawnToCash: String(bankWithdrawnToCash),
          closingCash: String(closingCash),
          closingBank: String(closingBank),
        })
        .where(eq(cashBankReconciliations.id, existing[0].id))
        .returning();
      return NextResponse.json(updated[0]);
    } else {
      const inserted = await db
        .insert(cashBankReconciliations)
        .values({
          id: `recon-m${monthIndex}-${Date.now()}`,
          financialYear: "२०२५ - २०२६",
          monthIndex: Number(monthIndex),
          monthName: monthName || "मासिक जुळवणी",
          openingCash: String(openingCash || 0),
          openingBank: String(openingBank || 0),
          monthlyIncomeCash: String(monthlyIncomeCash || 0),
          monthlyIncomeBank: String(monthlyIncomeBank || 0),
          cashDepositedToBank: String(cashDepositedToBank || 0),
          bankWithdrawnToCash: String(bankWithdrawnToCash || 0),
          closingCash: String(closingCash || 0),
          closingBank: String(closingBank || 0),
        })
        .returning();
      return NextResponse.json(inserted[0]);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
