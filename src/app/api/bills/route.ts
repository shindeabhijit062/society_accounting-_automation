import { NextResponse } from "next/server";
import { db } from "@/db";
import { monthlyBills, flats } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET(req: Request) {
  try {
    await seedDatabase();
    const { searchParams } = new URL(req.url);
    const flatId = searchParams.get("flatId");
    const monthIndex = searchParams.get("monthIndex");

    if (flatId) {
      const bills = await db
        .select()
        .from(monthlyBills)
        .where(eq(monthlyBills.flatId, flatId))
        .orderBy(asc(monthlyBills.monthIndex));
      return NextResponse.json(bills);
    }

    if (monthIndex) {
      const bills = await db
        .select({
          bill: monthlyBills,
          flat: flats,
        })
        .from(monthlyBills)
        .innerJoin(flats, eq(monthlyBills.flatId, flats.id))
        .where(eq(monthlyBills.monthIndex, Number(monthIndex)))
        .orderBy(asc(flats.srNo));
      return NextResponse.json(bills);
    }

    // Default: Return all bills joined with flat
    const bills = await db
      .select({
        bill: monthlyBills,
        flat: flats,
      })
      .from(monthlyBills)
      .innerJoin(flats, eq(monthlyBills.flatId, flats.id))
      .orderBy(asc(flats.srNo), asc(monthlyBills.monthIndex));

    return NextResponse.json(bills);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      billNo,
      billDate,
      serviceCharge,
      propertyTax,
      waterCharge,
      festivalFee,
      otherCharges,
      arrearsInterest,
      arrearsBalance,
      totalDue,
      receiptNo,
      paymentDate,
      amountPaid,
      remainingBalance,
      paymentMode,
      remarks,
    } = body;

    const sc = Number(serviceCharge) || 0;
    const pt = Number(propertyTax) || 0;
    const wc = Number(waterCharge) || 0;
    const ff = Number(festivalFee) || 0;
    const ot = Number(otherCharges) || 0;
    const ai = Number(arrearsInterest) || 0;
    const ab = Number(arrearsBalance) || 0;
    
    const computedTotal = sc + pt + wc + ff + ot + ai + ab;
    const paid = Number(amountPaid) || 0;
    const rem = computedTotal - paid;

    const updated = await db
      .update(monthlyBills)
      .set({
        billNo: String(billNo),
        billDate: String(billDate),
        serviceCharge: String(sc),
        propertyTax: String(pt),
        waterCharge: String(wc),
        festivalFee: String(ff),
        otherCharges: String(ot),
        arrearsInterest: String(ai),
        arrearsBalance: String(ab),
        totalDue: String(computedTotal),
        receiptNo: receiptNo || null,
        paymentDate: paymentDate || null,
        amountPaid: String(paid),
        remainingBalance: String(rem >= 0 ? rem : 0),
        paymentMode: paymentMode || "cash",
        remarks: remarks || "",
        updatedAt: new Date(),
      })
      .where(eq(monthlyBills.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
