import { NextResponse } from "next/server";
import { db } from "@/db";
import { flats, monthlyBills, expenses, cashBankReconciliations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { extractedData } = body;

    if (!extractedData) {
      return NextResponse.json({ error: "Missing extracted data" }, { status: 400 });
    }

    if (extractedData.docType === "expense") {
      let insertedCount = 0;
      const mName = extractedData.monthName || "एप्रिल २०२५ खर्च";
      const mIdx = 1; // April

      if (extractedData.expenses && Array.isArray(extractedData.expenses)) {
        for (const exp of extractedData.expenses) {
          await db.insert(expenses).values({
            id: `exp-ocr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            financialYear: "२०२५ - २०२६",
            monthIndex: mIdx,
            monthName: mName,
            date: exp.date || "०१.०४.२०२५",
            description: exp.description || "खर्च",
            voucherNo: exp.voucherNo || "०१",
            cashAmount: String(exp.cashAmount || 0),
            bankAmount: String(exp.bankAmount || 0),
            category: exp.category || "सामान्य खर्च",
          });
          insertedCount++;
        }
      }

      if (extractedData.reconciliation) {
        const r = extractedData.reconciliation;
        const existingRec = await db.select().from(cashBankReconciliations).where(eq(cashBankReconciliations.monthIndex, mIdx)).limit(1);
        if (existingRec.length > 0) {
          await db
            .update(cashBankReconciliations)
            .set({
              openingCash: String(r.openingCash || 0),
              openingBank: String(r.openingBank || 0),
              monthlyIncomeCash: String(r.monthlyIncomeCash || 0),
              monthlyIncomeBank: String(r.monthlyIncomeBank || 0),
              closingCash: String(r.closingCash || 0),
              closingBank: String(r.closingBank || 0),
            })
            .where(eq(cashBankReconciliations.id, existingRec[0].id));
        } else {
          await db.insert(cashBankReconciliations).values({
            id: `recon-m${mIdx}-${Date.now()}`,
            financialYear: "२०२५ - २०२६",
            monthIndex: mIdx,
            monthName: mName,
            openingCash: String(r.openingCash || 0),
            openingBank: String(r.openingBank || 0),
            monthlyIncomeCash: String(r.monthlyIncomeCash || 0),
            monthlyIncomeBank: String(r.monthlyIncomeBank || 0),
            closingCash: String(r.closingCash || 0),
            closingBank: String(r.closingBank || 0),
          });
        }
      }

      return NextResponse.json({ success: true, message: `${insertedCount} खर्च नोंदी यशस्वीपणे सेव्ह केल्या.` });
    }

    if (extractedData.docType === "ledger") {
      const flatNo = String(extractedData.flatNo || "").padStart(3, "0");
      const targetFlat = await db.select().from(flats).where(eq(flats.flatNo, flatNo)).limit(1);

      if (targetFlat.length === 0) {
        return NextResponse.json({ error: `सदनिका क्रमांक ${flatNo} सापडला नाही.` }, { status: 404 });
      }

      const flatId = targetFlat[0].id;
      let updatedCount = 0;

      if (extractedData.months && Array.isArray(extractedData.months)) {
        for (const m of extractedData.months) {
          const monthMap: Record<string, number> = {
            "एप्रिल": 1, "मे": 2, "जून": 3, "जुलै": 4, "ऑगस्ट": 5, "सप्टेंबर": 6,
            "ऑक्टोबर": 7, "नोव्हेंबर": 8, "डिसेंबर": 9, "जानेवारी": 10, "फेब्रुवारी": 11, "मार्च": 12
          };
          const mIdx = monthMap[m.monthName] || 1;

          const existingBill = await db
            .select()
            .from(monthlyBills)
            .where(and(eq(monthlyBills.flatId, flatId), eq(monthlyBills.monthIndex, mIdx)))
            .limit(1);

          if (existingBill.length > 0) {
            await db
              .update(monthlyBills)
              .set({
                billNo: String(m.billNo || existingBill[0].billNo),
                billDate: String(m.billDate || existingBill[0].billDate),
                serviceCharge: String(m.serviceCharge ?? 400),
                propertyTax: String(m.propertyTax ?? 0),
                waterCharge: String(m.waterCharge ?? 0),
                arrearsInterest: String(m.arrearsInterest ?? 0),
                arrearsBalance: String(m.arrearsBalance ?? 0),
                totalDue: String(m.totalDue ?? 400),
                receiptNo: m.receiptNo || null,
                paymentDate: m.paymentDate || null,
                amountPaid: String(m.amountPaid ?? 0),
                remainingBalance: String(m.remainingBalance ?? 0),
              })
              .where(eq(monthlyBills.id, existingBill[0].id));
            updatedCount++;
          }
        }
      }

      return NextResponse.json({ success: true, message: `सदनिका ${flatNo} च्या ${updatedCount} महिन्यांच्या नोंदी अद्ययावत केल्या.` });
    }

    if (extractedData.docType === "receipt") {
      const flatNo = String(extractedData.flatNo || "").padStart(3, "0");
      const targetFlat = await db.select().from(flats).where(eq(flats.flatNo, flatNo)).limit(1);

      if (targetFlat.length > 0) {
        // Find unpaid bill for this flat
        const unpaidBill = await db
          .select()
          .from(monthlyBills)
          .where(and(eq(monthlyBills.flatId, targetFlat[0].id), eq(monthlyBills.amountPaid, "0")))
          .limit(1);

        if (unpaidBill.length > 0) {
          const due = Number(unpaidBill[0].totalDue);
          const paid = Number(extractedData.amountPaid || 0);
          await db
            .update(monthlyBills)
            .set({
              receiptNo: String(extractedData.receiptNo),
              paymentDate: String(extractedData.paymentDate || "आज"),
              amountPaid: String(paid),
              remainingBalance: String(Math.max(0, due - paid)),
              paymentMode: extractedData.paymentMode || "cash",
            })
            .where(eq(monthlyBills.id, unpaidBill[0].id));

          return NextResponse.json({ success: true, message: `पावती क्रमांक ${extractedData.receiptNo} जमा करण्यात आली.` });
        }
      }
    }

    return NextResponse.json({ success: true, message: "डेटा प्रक्रिया पूर्ण झाली." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
