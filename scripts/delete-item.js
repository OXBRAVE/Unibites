const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const restaurants = await prisma.restaurant.findMany();
  for (const r of restaurants) {
    if (r.name.toLowerCase().includes("rehoboth titbit") || r.name.toLowerCase().includes("rehoboth")) {
        // Only if it's the specific titbit one, but I'll check for "Rehoboth Titbit"
        if (r.name.toLowerCase().includes("rehoboth titbit")) {
            console.log(`Deleting restaurant: ${r.name}`);
            
            // Delete related
            await prisma.feedback.deleteMany({ where: { restaurantId: r.id } });
            await prisma.orderItem.deleteMany({ where: { menuItem: { restaurantId: r.id } } });
            await prisma.order.deleteMany({ where: { restaurantId: r.id } });
            await prisma.menuItem.deleteMany({ where: { restaurantId: r.id } });
            await prisma.user.deleteMany({ where: { restaurantName: r.name } });
            
            await prisma.restaurant.delete({ where: { id: r.id } });
            console.log("Restaurant and related records deleted.");
        }
    }
  }

  const items = await prisma.menuItem.findMany();
  for (const i of items) {
    if (i.name.toLowerCase().includes("rehoboth titbit")) {
        console.log(`Deleting menu item: ${i.name}`);
        await prisma.orderItem.deleteMany({ where: { menuItemId: i.id } });
        await prisma.menuItem.delete({ where: { id: i.id } });
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
