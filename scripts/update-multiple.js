const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.menuItem.updateMany({
    where: { name: { contains: "Amala" } },
    data: { imageUrl: "/food-images/amala.jpg" }
  });
  
  await prisma.menuItem.updateMany({
    where: { name: { contains: "Beans" } },
    data: { imageUrl: "/food-images/beans.jpg" }
  });
  
  await prisma.menuItem.updateMany({
    where: { name: { contains: "Catfish" } },
    data: { imageUrl: "/food-images/catfish-pepper-soup.jpg" }
  });
  
  await prisma.menuItem.updateMany({
    where: { name: { contains: "fried yam" } },
    data: { imageUrl: "/food-images/fried-yam.jpg" }
  });
  
  await prisma.menuItem.updateMany({
    where: { name: { contains: "Poundo" } },
    data: { imageUrl: "/food-images/poundo-yam.jpg" }
  });

  console.log("Updated Amala, Beans, Catfish, fried yam, and Poundo Yam.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
