import { NextResponse } from "next/server";
import { db } from "@/db";
import { monthlyBills, flats, societyInfo } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { flatId } = body;

    const socList = await db.select().from(societyInfo).limit(1);
    const annualRate = Number(socList[0]?.interestRatePercent || 21);
    const monthlyRate = annualRate / 100 / 12; // e.g. 0.21 / 12 = 0.0175

    let targetFlats = [];
    if (flatId) {
      targetFlats = await db.select().from(flats).where(eq(flats.id, flatId));
    } else {
      targetFlats = await db.select().from(flats);
    }

    let updatedCount = 0;

    for (const f of targetFlats) {
      const bills = await db
        .select()
        .from(monthlyBills)
        .where(eq(monthlyBills.flatId, f.id))
        .orderBy(asc(monthlyBills.monthIndex));

      let currentArrears = 0;

      for (let i = 0; i < bills.length; i++) {
        const b = bills[i];
        
        // Compute interest on current arrears if any
        let interest = 0;
        if (currentArrears > 0) {
          interest = Math.round(currentArrears * monthlyRate);
        }

        const sc = Number(b.serviceCharge || 400);
        const pt = Number(b.propertyTax || 0);
        const wc = Number(b.waterCharge || 0);
        const ff = Number(b.festivalFee || 0);
        const ot = Number(b.otherCharges || 0);

        const totalDue = sc + pt + wc + ff + ot + interest + currentArrears;
        const paid = Number(b.amountPaid || 0);
        const rem = totalDue - paid;

        await db
          .update(monthlyBills)
          .set({
            arrearsBalance: String(currentArrears),
            arrearsInterest: String(interest),
            totalDue: String(totalDue),
            remainingBalance: String(rem >= 0 ? rem : 0),
          })
          .where(eq(monthlyBills.id, b.id));

        // Arrears for next month is remaining balance of this month
        currentArrears = rem >= 0 ? rem : 0;
        updatedCount++;
      }
    }

    return NextResponse.json({ success: true, count: updatedCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
