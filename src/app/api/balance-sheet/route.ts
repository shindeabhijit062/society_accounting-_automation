import { NextResponse } from "next/server";
import { db } from "@/db";
import { balanceSheetItems, monthlyBills, expenses, cashBankReconciliations } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET(req: Request) {
  try {
    await seedDatabase();
    const items = await db.select().from(balanceSheetItems).orderBy(asc(balanceSheetItems.displayOrder));

    // Calculate real-time totals from bills and expenses
    const allBills = await db.select().from(monthlyBills);
    const allExpenses = await db.select().from(expenses);

    let totalMemberArrears = 0;
    let totalServiceIncome = 0;

    for (const b of allBills) {
      totalMemberArrears += Number(b.remainingBalance || 0);
      totalServiceIncome += Number(b.amountPaid || 0);
    }

    let totalExpensesCash = 0;
    let totalExpensesBank = 0;
    for (const e of allExpenses) {
      totalExpensesCash += Number(e.cashAmount || 0);
      totalExpensesBank += Number(e.bankAmount || 0);
    }

    // Split liabilities and assets
    const liabilities = items.filter((i) => i.categoryType === "liability");
    const assets = items.filter((i) => i.categoryType === "asset");

    return NextResponse.json({
      liabilities,
      assets,
      summaryStats: {
        totalMemberArrears,
        totalServiceIncome,
        totalExpenses: totalExpensesCash + totalExpensesBank,
        cashExpenses: totalExpensesCash,
        bankExpenses: totalExpensesBank,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categoryType, mainGroup, mainGroupMr, itemName, itemNameMr, amount } = body;

    const newId = `bs-${Date.now()}`;
    const inserted = await db
      .insert(balanceSheetItems)
      .values({
        id: newId,
        financialYear: "२०२५ - २०२६",
        categoryType,
        mainGroup,
        mainGroupMr,
        itemName,
        itemNameMr,
        amount: String(amount || 0),
        displayOrder: 99,
      })
      .returning();

    return NextResponse.json(inserted[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, itemName, itemNameMr, amount } = body;

    const updated = await db
      .update(balanceSheetItems)
      .set({
        itemName,
        itemNameMr,
        amount: String(amount),
      })
      .where(eq(balanceSheetItems.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
