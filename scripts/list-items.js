const fs = require('fs');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const items = await prisma.menuItem.findMany();
  fs.writeFileSync('menu-items.json', JSON.stringify(items, null, 2), 'utf8');
  console.log('Saved menu items to menu-items.json');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
