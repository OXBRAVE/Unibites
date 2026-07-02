const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'superadmin@unibites.com';
  const password = 'superpassword123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'UniBites Super Admin',
        email: email,
        password: hashedPassword,
        role: 'SUPERADMIN'
      }
    });
    console.log(`Superadmin created. Email: ${email}, Password: ${password}`);
  } else {
    await prisma.user.update({
      where: { email },
      data: { role: 'SUPERADMIN', password: hashedPassword }
    });
    console.log('Superadmin updated.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
