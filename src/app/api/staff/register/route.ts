import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, restaurantName, password } = body;

    if (!name || !email || !password || !restaurantName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with email already exists" }, { status: 409 });
    }

    // Ensure the restaurant exists, if not create it
    let restaurant = await prisma.restaurant.findUnique({
      where: { name: restaurantName },
    });

    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: {
          name: restaurantName,
          description: `Welcome to ${restaurantName}!`,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        restaurantName,
        role: "ADMIN",
      },
    });

    const userWithoutPassword = { ...user } as any;
    delete userWithoutPassword.password;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Staff registration error:", error);
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 });
  }
}
