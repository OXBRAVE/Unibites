const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.menuItem.updateMany({
    where: { 
      name: { contains: "Yam&egg" }
    },
    data: { 
      imageUrl: "/food-images/yam-and-egg.jpg"
    }
  });
  console.log(`Updated ${result.count} Yam&egg items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
