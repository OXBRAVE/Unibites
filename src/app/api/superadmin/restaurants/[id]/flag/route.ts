import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { isFlagged, flagMessage } = await request.json();
    const { id } = await params;

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: { 
        isFlagged,
        flagMessage: isFlagged ? flagMessage : null
      }
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error flagging restaurant:", error);
    return NextResponse.json({ message: "Error updating restaurant status" }, { status: 500 });
  }
}
