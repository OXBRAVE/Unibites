const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const placeholderImages = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", // Salad
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", // Healthy
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop", // Gourmet
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", // Pizza
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop", // Steak
  "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop", // Burger
];

async function main() {
  const items = await prisma.menuItem.findMany();
  console.log(`Found ${items.length} menu items.`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const imageUrl = placeholderImages[i % placeholderImages.length];
    
    await prisma.menuItem.update({
      where: { id: item.id },
      data: { imageUrl: imageUrl }
    });
    console.log(`Updated ${item.name} with image.`);
  }

  console.log("Image seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
