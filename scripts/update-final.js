const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.menuItem.updateMany({
    where: { name: { contains: "Porridge" } },
    data: { imageUrl: "/food-images/porridge.jpg" }
  });
  
  await prisma.menuItem.updateMany({
    where: { name: "Rice and stew" },
    data: { imageUrl: "/food-images/rice-and-stew.jpg" }
  });
  
  await prisma.menuItem.updateMany({
    where: { name: "Rice" },
    data: { imageUrl: "/food-images/rice.jpg" }
  });

  console.log("Updated Porridge, Rice and stew, and Rice.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
