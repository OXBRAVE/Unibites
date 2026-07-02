const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  fs.writeFileSync('users_db.json', JSON.stringify(users, null, 2));
  const restaurants = await prisma.restaurant.findMany();
  fs.writeFileSync('restaurants_db.json', JSON.stringify(restaurants, null, 2));
  const orders = await prisma.order.findMany();
  fs.writeFileSync('orders_db.json', JSON.stringify(orders, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
