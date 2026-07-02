import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    
    // Auto-match image based on name
    const imageName = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const potentialImageUrl = `/food-images/${imageName}.jpg`;
    
    // In a production Next.js environment, we should ideally check filesystem or a bucket.
    // For this setup, we'll try to find a matching image name from our existing assets.
    const menuItemData = {
      ...body,
      imageUrl: potentialImageUrl
    };

    const menuItem = await prisma.menuItem.create({ data: menuItemData });
    return NextResponse.json(menuItem);
  } catch {
    return NextResponse.json({ message: "Error creating menu item" }, { status: 500 });
  }
}
