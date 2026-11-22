import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ user: null });

    const payload: any = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub));
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
