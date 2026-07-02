import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(restaurant);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A restaurant with this name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const restaurants = await prisma.restaurant.findMany({
    include: {
      _count: {
        select: { orders: true, menuItems: true }
      },
      feedbacks: true
    }
  });

  return NextResponse.json(restaurants);
}
