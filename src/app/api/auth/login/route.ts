import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) return NextResponse.json({ error: "Missing email or password" }, { status: 400 });

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ sub: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET || "devsecret", {
      expiresIn: "7d",
    });

    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
