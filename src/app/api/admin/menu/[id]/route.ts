import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const resolvedParams = await Promise.resolve(params);

    const imageName = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const potentialImageUrl = `/food-images/${imageName}.jpg`;

    const menuItemData = {
      ...body,
      imageUrl: potentialImageUrl
    };

    const menuItem = await prisma.menuItem.update({
      where: { id: resolvedParams.id },
      data: menuItemData
    });
    return NextResponse.json(menuItem);
  } catch {
    return NextResponse.json({ message: "Error updating menu item" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await Promise.resolve(params);
    await prisma.menuItem.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Error deleting menu item" }, { status: 500 });
  }
}
