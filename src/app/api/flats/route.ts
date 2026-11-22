import { NextResponse } from "next/server";
import { db } from "@/db";
import { flats, monthlyBills } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    await seedDatabase();
    const flatList = await db.select().from(flats).orderBy(asc(flats.srNo));
    return NextResponse.json(flatList);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { srNo, flatNo, memberName, areaSqft, transferDate, transferFee, entranceFee, notes } = body;

    const newId = `flat-${Date.now()}`;
    const inserted = await db
      .insert(flats)
      .values({
        id: newId,
        srNo: Number(srNo) || 1,
        flatNo: String(flatNo),
        memberName: String(memberName),
        areaSqft: Number(areaSqft) || 225,
        transferDate: transferDate || null,
        transferFee: String(transferFee || 0),
        entranceFee: String(entranceFee || 0),
        notes: notes || "",
      })
      .returning();

    // Generate 12 empty monthly bills for this flat
    const months = ["एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर", "जानेवारी", "फेब्रुवारी", "मार्च"];
    for (let i = 0; i < months.length; i++) {
      await db.insert(monthlyBills).values({
        id: `bill-${newId}-${i + 1}`,
        flatId: newId,
        financialYear: "२०२५ - २०२६",
        monthIndex: i + 1,
        monthName: months[i],
        billNo: `${(i + 1) * 10 + (Number(srNo) || 1)}`,
        billDate: `०१.०${i + 4 > 12 ? (i + 4 - 12 < 10 ? '0' + (i + 4 - 12) : i + 4 - 12) : (i + 4 < 10 ? '0' + (i + 4) : i + 4)}.२०२५`,
        serviceCharge: "400",
        propertyTax: "0",
        waterCharge: "0",
        festivalFee: "0",
        otherCharges: "0",
        arrearsInterest: "0",
        arrearsBalance: "0",
        totalDue: "400",
        amountPaid: "0",
        remainingBalance: "400",
      });
    }

    return NextResponse.json(inserted[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
