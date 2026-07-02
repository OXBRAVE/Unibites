import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.restaurant.deleteMany({
    where: {
      name: "AI Test Kitchen"
    }
  });
  console.log(`Deleted ${result.count} restaurants.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
