import { pgTable, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";

export const societyInfo = pgTable("society_info", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  regNo: text("reg_no").notNull(),
  address: text("address").notNull(),
  financialYear: text("financial_year").notNull().default("२०२५ - २०२६"),
  defaultServiceCharge: numeric("default_service_charge").notNull().default("400"),
  interestRatePercent: numeric("interest_rate_percent").notNull().default("21"),
  chairmanName: text("chairman_name").default("श्री अध्यक्ष"),
  secretaryName: text("secretary_name").default("श्री सेक्रेटरी"),
  treasurerName: text("treasurer_name").default("आर. के. मौर्य"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flats = pgTable("flats", {
  id: text("id").primaryKey(),
  srNo: integer("sr_no").notNull(),
  flatNo: text("flat_no").notNull(),
  memberName: text("member_name").notNull(),
  areaSqft: integer("area_sqft").notNull().default(225),
  transferDate: text("transfer_date"),
  transferFee: numeric("transfer_fee").default("0"),
  entranceFee: numeric("entrance_fee").default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const monthlyBills = pgTable("monthly_bills", {
  id: text("id").primaryKey(),
  flatId: text("flat_id").notNull().references(() => flats.id, { onDelete: 'cascade' }),
  financialYear: text("financial_year").notNull().default("२०२५ - २०२६"),
  monthIndex: integer("month_index").notNull(), // 1 to 12
  monthName: text("month_name").notNull(), // एप्रिल, मे, जून, ...
  billNo: text("bill_no").notNull(),
  billDate: text("bill_date").notNull(),
  serviceCharge: numeric("service_charge").notNull().default("400"),
  propertyTax: numeric("property_tax").notNull().default("0"),
  waterCharge: numeric("water_charge").notNull().default("0"),
  festivalFee: numeric("festival_fee").notNull().default("0"),
  otherCharges: numeric("other_charges").notNull().default("0"),
  arrearsInterest: numeric("arrears_interest").notNull().default("0"),
  arrearsBalance: numeric("arrears_balance").notNull().default("0"),
  totalDue: numeric("total_due").notNull().default("0"),
  receiptNo: text("receipt_no"),
  paymentDate: text("payment_date"),
  amountPaid: numeric("amount_paid").notNull().default("0"),
  remainingBalance: numeric("remaining_balance").notNull().default("0"),
  paymentMode: text("payment_mode").default("cash"), // cash, bank, upi, cheque
  remarks: text("remarks"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: text("id").primaryKey(),
  financialYear: text("financial_year").notNull().default("२०२५ - २०२६"),
  monthIndex: integer("month_index").notNull(), // 1 to 12
  monthName: text("month_name").notNull(), // एप्रिल २०२५ खर्च
  date: text("date").notNull(),
  description: text("description").notNull(),
  voucherNo: text("voucher_no").notNull(),
  cashAmount: numeric("cash_amount").notNull().default("0"),
  bankAmount: numeric("bank_amount").notNull().default("0"),
  category: text("category").default("सामान्य खर्च"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cashBankReconciliations = pgTable("cash_bank_reconciliations", {
  id: text("id").primaryKey(),
  financialYear: text("financial_year").notNull().default("२०२५ - २०२६"),
  monthIndex: integer("month_index").notNull(), // 1 to 12
  monthName: text("month_name").notNull(),
  openingCash: numeric("opening_cash").notNull().default("0"),
  openingBank: numeric("opening_bank").notNull().default("0"),
  monthlyIncomeCash: numeric("monthly_income_cash").notNull().default("0"),
  monthlyIncomeBank: numeric("monthly_income_bank").notNull().default("0"),
  cashDepositedToBank: numeric("cash_deposited_to_bank").notNull().default("0"),
  bankWithdrawnToCash: numeric("bank_withdrawn_to_cash").notNull().default("0"),
  closingCash: numeric("closing_cash").notNull().default("0"),
  closingBank: numeric("closing_bank").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const balanceSheetItems = pgTable("balance_sheet_items", {
  id: text("id").primaryKey(),
  financialYear: text("financial_year").notNull().default("२०२५ - २०२६"),
  categoryType: text("category_type").notNull(), // liability, asset
  mainGroup: text("main_group").notNull(), // Capital Account, Current Liabilities, etc.
  mainGroupMr: text("main_group_mr").notNull(), // भांडवल खाते, चालू देणी, etc.
  itemName: text("item_name").notNull(),
  itemNameMr: text("item_name_mr").notNull(),
  amount: numeric("amount").notNull().default("0"),
  subAmount: numeric("sub_amount"), // for nested lines if any
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scannedDocuments = pgTable("scanned_documents", {
  id: text("id").primaryKey(),
  documentType: text("document_type").notNull(), // ledger, expense, voucher, balance_sheet
  fileName: text("file_name").notNull(),
  fileDataUrl: text("file_data_url"),
  extractedJson: text("extracted_json"),
  status: text("status").notNull().default("pending"), // pending, processed, applied
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  role: text("role").notNull().default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow(),
});
