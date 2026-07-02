import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { status } = await request.json();
    const { id } = await params;

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ message: "Error updating order" }, { status: 500 });
  }
}
