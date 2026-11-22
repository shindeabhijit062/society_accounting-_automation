import { NextResponse } from "next/server";
import { db } from "@/db";
import { societyInfo } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    await seedDatabase();
    const societies = await db.select().from(societyInfo).limit(1);
    if (societies.length === 0) {
      return NextResponse.json({ error: "No society found" }, { status: 404 });
    }
    return NextResponse.json(societies[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, regNo, address, financialYear, defaultServiceCharge, interestRatePercent, chairmanName, secretaryName, treasurerName } = body;

    const updated = await db
      .update(societyInfo)
      .set({
        name,
        regNo,
        address,
        financialYear,
        defaultServiceCharge: String(defaultServiceCharge),
        interestRatePercent: String(interestRatePercent),
        chairmanName,
        secretaryName,
        treasurerName,
      })
      .where(eq(societyInfo.id, id || "soc-1"))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
