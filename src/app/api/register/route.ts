import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, studentId, hallOfResid, password } = body;

    // Basic validation
    if (!name || !email || !password || !studentId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { studentId }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with email or student ID already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        studentId,
        hallOfResid,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    // Exclude password from the returned object safely
    const userWithoutPassword = { ...user } as any;
    delete userWithoutPassword.password;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 });
  }
}
