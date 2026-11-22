import { db } from "./index";
import { societyInfo, flats, monthlyBills, expenses, cashBankReconciliations, balanceSheetItems, users } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    const existingSociety = await db.select().from(societyInfo).limit(1);
    if (existingSociety.length > 0) {
      console.log("Database already seeded");
      return;
    }

    // 1. Society Info
    await db.insert(societyInfo).values({
      id: "soc-1",
      name: "श्री सद्गुरुकृपा २२/एच एसआरए सहकारा गृहनिर्माण संस्था मर्यादित",
      regNo: "२२/एच/एसआरए/सहकारा/इमारत क्रमांक २२/एच, चांदिवली, मुंबई",
      address: "इमारत क्रमांक २२/एच, संघर्ष नगर, चांदिवली (पूर्व), मुंबई - ४०० ०७२",
      financialYear: "२०२५ - २०२६",
      defaultServiceCharge: "400",
      interestRatePercent: "21",
      chairmanName: "श्री अध्यक्ष",
      secretaryName: "श्री सेक्रेटरी",
      treasurerName: "आर. के. मौर्य",
    });

    // 2. Flats
    const flatRecords = [
      {
        id: "flat-001",
        srNo: 1,
        flatNo: "001",
        memberName: "विलास दादाराव साळूंखे",
        areaSqft: 225,
        notes: "पुष्पा दादाराव साळूंखे",
        transferFee: "500",
        entranceFee: "50",
      },
      {
        id: "flat-002",
        srNo: 2,
        flatNo: "002",
        memberName: "कृष्णा बाबाजी गुरव",
        areaSqft: 225,
        notes: "-",
        transferFee: "0",
        entranceFee: "0",
      },
      {
        id: "flat-003",
        srNo: 3,
        flatNo: "003",
        memberName: "संतोष तानाजी कदम",
        areaSqft: 225,
        notes: "",
        transferFee: "0",
        entranceFee: "0",
      },
      {
        id: "flat-004",
        srNo: 4,
        flatNo: "004",
        memberName: "रवींद्र बाळकृष्ण पवार",
        areaSqft: 225,
        notes: "",
        transferFee: "0",
        entranceFee: "0",
      },
      {
        id: "flat-005",
        srNo: 5,
        flatNo: "005",
        memberName: "सचिन तुकाराम शिंदे",
        areaSqft: 225,
        notes: "",
        transferFee: "0",
        entranceFee: "0",
      },
      {
        id: "flat-006",
        srNo: 6,
        flatNo: "006",
        memberName: "मंगेश दत्तात्रय मोरे",
        areaSqft: 225,
        notes: "",
        transferFee: "0",
        entranceFee: "0",
      },
    ];

    await db.insert(flats).values(flatRecords);

    // 3. Monthly Bills for Flat 002 (Krishna Babaji Gurav)
    const months = [
      { idx: 1, name: "एप्रिल", billNo: "२", date: "०१.०४.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 59, arr: 3372, recNo: "२९५३", recDate: "०६.०४.२०२५", paid: 3831 },
      { idx: 2, name: "मे", billNo: "४९", date: "०१.०५.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 0, arr: 0, recNo: "२९८७", recDate: "२३.०५.२०२५", paid: 400 },
      { idx: 3, name: "जून", billNo: "९६", date: "०१.०६.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 0, arr: 0, recNo: "", recDate: "", paid: 0 },
      { idx: 4, name: "जुलै", billNo: "१४३", date: "०१.०७.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 7, arr: 400, recNo: "", recDate: "", paid: 0 },
      { idx: 5, name: "ऑगस्ट", billNo: "१९०", date: "०१.०८.२०२५", sc: 400, pt: 235, wc: 0, ff: 0, ot: 0, int: 14, arr: 807, recNo: "०४१", recDate: "१०.०८.२०२५", paid: 1456 },
      { idx: 6, name: "सप्टेंबर", billNo: "२३७", date: "०१.०९.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 0, arr: 0, recNo: "", recDate: "", paid: 0 },
      { idx: 7, name: "ऑक्टोबर", billNo: "२८४", date: "०१.१०.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 7, arr: 400, recNo: "", recDate: "", paid: 0 },
      { idx: 8, name: "नोव्हेंबर", billNo: "३३१", date: "०१.११.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 14, arr: 807, recNo: "", recDate: "", paid: 0 },
      { idx: 9, name: "डिसेंबर", billNo: "३७८", date: "०१.१२.२०२५", sc: 400, pt: 0, wc: 250, ff: 0, ot: 0, int: 21, arr: 1221, recNo: "", recDate: "", paid: 0 },
      { idx: 10, name: "जानेवारी", billNo: "४२५", date: "०१.०१.२०२६", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 32, arr: 1892, recNo: "", recDate: "", paid: 0 },
      { idx: 11, name: "फेब्रुवारी", billNo: "४७२", date: "०१.०२.२०२६", sc: 400, pt: 0, wc: 250, ff: 0, ot: 0, int: 39, arr: 2324, recNo: "१६८", recDate: "११.०२.२०२६", paid: 3013 },
      { idx: 12, name: "मार्च", billNo: "५१९", date: "०१.०३.२०२६", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 0, arr: 0, recNo: "", recDate: "", paid: 0 },
    ];

    for (const m of months) {
      const totalDue = m.sc + m.pt + m.wc + m.ff + m.ot + m.int + m.arr;
      const rem = totalDue - m.paid;
      await db.insert(monthlyBills).values({
        id: `bill-flat002-${m.idx}`,
        flatId: "flat-002",
        financialYear: "२०२५ - २०२६",
        monthIndex: m.idx,
        monthName: m.name,
        billNo: m.billNo,
        billDate: m.date,
        serviceCharge: m.sc.toString(),
        propertyTax: m.pt.toString(),
        waterCharge: m.wc.toString(),
        festivalFee: m.ff.toString(),
        otherCharges: m.ot.toString(),
        arrearsInterest: m.int.toString(),
        arrearsBalance: m.arr.toString(),
        totalDue: totalDue.toString(),
        receiptNo: m.recNo || null,
        paymentDate: m.recDate || null,
        amountPaid: m.paid.toString(),
        remainingBalance: rem.toString(),
        paymentMode: m.paid > 0 ? "cash" : "cash",
      });
    }

    // 4. Monthly Bills for Flat 001 (Vilas Dadarao Salunkhe)
    const monthsFlat1 = [
      { idx: 1, name: "एप्रिल", billNo: "१", date: "०१.०४.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 224, arr: 12782, recNo: "", recDate: "", paid: 0 },
      { idx: 2, name: "मे", billNo: "४८", date: "०१.०५.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 231, arr: 13406, recNo: "", recDate: "", paid: 0 },
      { idx: 3, name: "जून", billNo: "९५", date: "०१.०६.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 238, arr: 14037, recNo: "", recDate: "", paid: 0 },
      { idx: 4, name: "जुलै", billNo: "१४२", date: "०१.०७.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 245, arr: 14675, recNo: "", recDate: "", paid: 0 },
      { idx: 5, name: "ऑगस्ट", billNo: "१८९", date: "०१.०८.२०२५", sc: 400, pt: 235, wc: 0, ff: 0, ot: 0, int: 252, arr: 15320, recNo: "", recDate: "", paid: 0 },
      { idx: 6, name: "सप्टेंबर", billNo: "२३६", date: "०१.०९.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 260, arr: 16207, recNo: "", recDate: "", paid: 0 },
      { idx: 7, name: "ऑक्टोबर", billNo: "२८३", date: "०१.१०.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 267, arr: 16867, recNo: "", recDate: "", paid: 0 },
      { idx: 8, name: "नोव्हेंबर", billNo: "३३०", date: "०१.११.२०२५", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 274, arr: 17534, recNo: "", recDate: "", paid: 0 },
      { idx: 9, name: "डिसेंबर", billNo: "३७७", date: "०१.१२.२०२५", sc: 400, pt: 0, wc: 250, ff: 0, ot: 0, int: 281, arr: 18208, recNo: "", recDate: "", paid: 0 },
      { idx: 10, name: "जानेवारी", billNo: "४२४", date: "०१.०१.२०२६", sc: 400, pt: 0, wc: 0, ff: 0, ot: 0, int: 295, arr: 19139, recNo: "", recDate: "", paid: 0 },
      { idx: 11, name: "फेब्रुवारी", billNo: "४७१", date: "०१.०२.२०२६", sc: 400, pt: 0, wc: 250, ff: 0, ot: 0, int: 302, arr: 19834, recNo: "", recDate: "", paid: 0 },
      { idx: 12, name: "मार्च", billNo: "५१८", date: "०१.०३.२०२६", sc: 400, pt: 0, wc: 0, ff: 0, ot: 650, int: 314, arr: 20786, recNo: "२०४", recDate: "२२.०३.२०२६", paid: 650 },
    ];

    for (const m of monthsFlat1) {
      const totalDue = m.sc + m.pt + m.wc + m.ff + m.ot + m.int + m.arr;
      const rem = totalDue - m.paid;
      await db.insert(monthlyBills).values({
        id: `bill-flat001-${m.idx}`,
        flatId: "flat-001",
        financialYear: "२०२५ - २०२६",
        monthIndex: m.idx,
        monthName: m.name,
        billNo: m.billNo,
        billDate: m.date,
        serviceCharge: m.sc.toString(),
        propertyTax: m.pt.toString(),
        waterCharge: m.wc.toString(),
        festivalFee: m.ff.toString(),
        otherCharges: m.ot.toString(),
        arrearsInterest: m.int.toString(),
        arrearsBalance: m.arr.toString(),
        totalDue: totalDue.toString(),
        receiptNo: m.recNo || null,
        paymentDate: m.recDate || null,
        amountPaid: m.paid.toString(),
        remainingBalance: rem.toString(),
        paymentMode: "cash",
      });
    }

    // Bills for flats 003..006
    for (const flat of flatRecords.slice(2)) {
      for (const m of months) {
        await db.insert(monthlyBills).values({
          id: `bill-${flat.id}-${m.idx}`,
          flatId: flat.id,
          financialYear: "२०२५ - २०२६",
          monthIndex: m.idx,
          monthName: m.name,
          billNo: `${m.idx * 10 + flat.srNo}`,
          billDate: m.date,
          serviceCharge: "400",
          propertyTax: "0",
          waterCharge: "0",
          festivalFee: "0",
          otherCharges: "0",
          arrearsInterest: "0",
          arrearsBalance: "0",
          totalDue: "400",
          receiptNo: `२०${m.idx + 5}`,
          paymentDate: `०५.०${m.idx > 9 ? m.idx : "0" + m.idx}.२०२५`,
          amountPaid: "400",
          remainingBalance: "0",
          paymentMode: "bank",
        });
      }
    }

    // 5. April 2025 Expenses (from notebook image 2)
    const expenseList = [
      { date: "०८.०४.२०२५", desc: "संकुल सेवा शुल्क भरण्यात आला. चेक नं. ०५९७३२", voucher: "०१", cash: "0", bank: "12000", cat: "सेवा शुल्क" },
      { date: "१६.०४.२०२५", desc: "सोसायटीचे लाईट बिल भरण्यात आले चेक नं. ०५९७३४", voucher: "०२", cash: "0", bank: "4580", cat: "लाईट बिल" },
      { date: "१६.०४.२०२५", desc: "सोसायटीचे लाईट बिल भरण्याकरीता जाने येणे प्रवास खर्च", voucher: "०३", cash: "100", bank: "0", cat: "प्रवास खर्च" },
      { date: "२१.०४.२०२५", desc: "सोसायटी लिफ्ट रिपेअरिंग खर्च चेक नं. ०५९७३५", voucher: "०४", cash: "0", bank: "20000", cat: "रिपेअरिंग" },
      { date: "२२.०४.२०२५", desc: "सोसायटी लिफ्ट रिपेअरिंग करण्याची मजुरी देण्यात आली .", voucher: "०५", cash: "1000", bank: "0", cat: "मजुरी खर्च" },
      { date: "२२.०४.२०२५", desc: "सोसायटी लिफ्ट रिपेअरिंग करीता हार्डवेअरचे सामान खरेदी करण्यात आले .", voucher: "०६", cash: "7500", bank: "0", cat: "सामान खरेदी" },
      { date: "२३.०४.२०२५", desc: "पावती बुक छपाई खर्च", voucher: "०७", cash: "4500", bank: "0", cat: "छपाई खर्च" },
      { date: "३०.०४.२०२५", desc: "बँकेत जाने येणे प्रवास खर्च", voucher: "०८", cash: "100", bank: "0", cat: "प्रवास खर्च" },
    ];

    for (let i = 0; i < expenseList.length; i++) {
      const e = expenseList[i];
      await db.insert(expenses).values({
        id: `exp-apr-${i + 1}`,
        financialYear: "२०२५ - २०२६",
        monthIndex: 1,
        monthName: "एप्रिल २०२५ खर्च",
        date: e.date,
        description: e.desc,
        voucherNo: e.voucher,
        cashAmount: e.cash,
        bankAmount: e.bank,
        category: e.cat,
      });
    }

    // 6. Cash Bank Reconciliation (Image 2 summary)
    await db.insert(cashBankReconciliations).values({
      id: "recon-apr-2025",
      financialYear: "२०२५ - २०२६",
      monthIndex: 1,
      monthName: "एप्रिल २०२५",
      openingCash: "10828",
      openingBank: "755794",
      monthlyIncomeCash: "49841",
      monthlyIncomeBank: "1900",
      cashDepositedToBank: "41400",
      bankWithdrawnToCash: "0",
      closingCash: "6069",
      closingBank: "722514",
    });

    // 7. Balance Sheet Items (from Image 5 & 6)
    const bsItems = [
      // LIABILITIES
      { type: "liability", group: "Capital Account", groupMr: "भांडवल खाते", item: "Reserves & Surplus", itemMr: "राखीव व सरप्लस निधी", amount: "1271547.00", order: 1 },
      { type: "liability", group: "Capital Account", groupMr: "भांडवल खाते", item: "Paid- Up Share", itemMr: "वसूल झालेले भाग भांडवल", amount: "2350.00", order: 2 },
      { type: "liability", group: "Loans (Liability)", groupMr: "कर्ज (देणी)", item: "Unsecured Loans", itemMr: "विनातारण कर्ज", amount: "0.00", order: 3 },
      { type: "liability", group: "Current Liabilities", groupMr: "चालू देणी", item: "Accounting Charges Payable", itemMr: "लेखापरीक्षण / हिशोब फी देणे", amount: "8460.00", order: 4 },
      { type: "liability", group: "Current Liabilities", groupMr: "चालू देणी", item: "Audit Fees Payable", itemMr: "ऑडिट फी देणे", amount: "4700.00", order: 5 },
      { type: "liability", group: "Current Liabilities", groupMr: "चालू देणी", item: "Education- Training Fees Payable", itemMr: "शिक्षण व प्रशिक्षण फी देणे", amount: "5506.00", order: 6 },
      { type: "liability", group: "Current Liabilities", groupMr: "चालू देणी", item: "Property Tax Payable", itemMr: "मालमत्ता कर देणे", amount: "140960.00", order: 7 },
      { type: "liability", group: "Current Liabilities", groupMr: "चालू देणी", item: "Repar Provision", itemMr: "दुरुस्ती तरतूद निधी", amount: "316400.00", order: 8 },
      { type: "liability", group: "Profit & Loss A/c", groupMr: "नफा व तोटा खाते", item: "Opening Balance", itemMr: "मागील शिल्लक (नफा)", amount: "443814.00", order: 9 },
      { type: "liability", group: "Profit & Loss A/c", groupMr: "नफा व तोटा खाते", item: "Current Period", itemMr: "चालू वर्षाचा नफा", amount: "10741.00", order: 10 },
      { type: "liability", group: "Profit & Loss A/c", groupMr: "नफा व तोटा खाते", item: "Less: Transferred", itemMr: "वजा: हस्तांतरित निधी", amount: "-54523.00", order: 11 },

      // ASSETS
      { type: "asset", group: "Fixed Assets", groupMr: "कायम मालमत्ता", item: "Fire Extinguisher", itemMr: "अग्निशामक यंत्र (Fire Extinguisher)", amount: "2756.00", order: 1 },
      { type: "asset", group: "Fixed Assets", groupMr: "कायम मालमत्ता", item: "Furniture", itemMr: "फर्निचर (Furniture)", amount: "3192.00", order: 2 },
      { type: "asset", group: "Investments", groupMr: "गुंतवणूक", item: "MDDC Bank Membership Share", itemMr: "एमडीडीसी बँक सभासद भाग", amount: "1000.00", order: 3 },
      { type: "asset", group: "Investments", groupMr: "गुंतवणूक", item: "Sangharsh Nagar Cluster Fed Share", itemMr: "संघर्ष नगर क्लस्टर फेड. भाग", amount: "350.00", order: 4 },
      { type: "asset", group: "Investments", groupMr: "गुंतवणूक", item: "SRA & Society Joint FD", itemMr: "एसआरए व सोसायटी संयुक्त एफडी", amount: "960000.00", order: 5 },
      { type: "asset", group: "Investments", groupMr: "गुंतवणूक", item: "The Mumbai Housing Fed. Share", itemMr: "द मुंबई हाऊसिंग फेड. भाग", amount: "100.00", order: 6 },
      { type: "asset", group: "Current Assets", groupMr: "चालू मालमत्ता", item: "Closing Stock", itemMr: "अंतिम साठा (Closing Stock)", amount: "301415.00", order: 7 },
      { type: "asset", group: "Current Assets", groupMr: "चालू मालमत्ता", item: "Sundry Debtors", itemMr: "सभासद येणे बाकी (Sundry Debtors)", amount: "1092.00", order: 8 },
      { type: "asset", group: "Current Assets", groupMr: "चालू मालमत्ता", item: "Cash-in-Hand", itemMr: "हाती रोख शिल्लक (Cash-in-Hand)", amount: "6069.00", order: 9 },
      { type: "asset", group: "Current Assets", groupMr: "चालू मालमत्ता", item: "Bank Accounts", itemMr: "बँक खाती शिल्लक (Bank Accounts)", amount: "872997.00", order: 10 },
      { type: "asset", group: "Current Assets", groupMr: "चालू मालमत्ता", item: "TDS", itemMr: "टीडीएस (TDS)", amount: "7053.00", order: 11 },
    ];

    for (let idx = 0; idx < bsItems.length; idx++) {
      const item = bsItems[idx];
      await db.insert(balanceSheetItems).values({
        id: `bs-item-${idx + 1}`,
        financialYear: "२०२५ - २०२६",
        categoryType: item.type,
        mainGroup: item.group,
        mainGroupMr: item.groupMr,
        itemName: item.item,
        itemNameMr: item.itemMr,
        amount: item.amount,
        displayOrder: item.order,
      });
    }

    console.log("Database seeded successfully!");

    // 8. Default admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@local";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminHash = bcrypt.hashSync(adminPassword, 10);
    await db.insert(users).values({
      id: "user-admin",
      email: adminEmail,
      passwordHash: adminHash,
      name: "Administrator",
      role: "admin",
    });
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
