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

    const { items, totalAmount } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const restaurantId = items[0].restaurantId;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        restaurantId,
        totalAmount,
        status: "Pending",
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ message: "An error occurred while placing the order" }, { status: 500 });
  }
}
