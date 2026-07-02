import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { restaurantId, rating, comment } = await request.json();

    const feedback = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        restaurantId,
        rating,
        comment,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
