import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const restaurants = [
    { name: "Manna", description: "Healthy and affordable meals." },
    { name: "Onisasun", description: "Delicious local cuisine." },
    { name: "Dome", description: "The best fast food on campus." },
    { name: "Rehoboth", description: "Premium dining experience." },
  ];

  // 1. Create Restaurants
  for (const r of restaurants) {
    const existing = await prisma.restaurant.findUnique({
      where: { name: r.name },
    });
    if (!existing) {
      await prisma.restaurant.create({ data: r });
      console.log(`Created restaurant: ${r.name}`);
    }
  }

  // 2. Create Pre-defined Admins for each Restaurant
  const passwordHash = await bcrypt.hash("admin123", 10);
  for (const r of restaurants) {
    const adminEmail = `admin@${r.name.toLowerCase()}.com`;
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          name: `${r.name} Admin`,
          email: adminEmail,
          password: passwordHash,
          role: "ADMIN",
          restaurantName: r.name,
        },
      });
      console.log(`Created admin for ${r.name} (${adminEmail})`);
    }
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
