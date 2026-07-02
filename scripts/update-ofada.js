const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.menuItem.updateMany({
    where: { 
      name: { contains: "Ofada" }
    },
    data: { 
      imageUrl: "/food-images/ofada-rice.jpg"
    }
  });
  console.log(`Updated ${result.count} Ofada rice items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
