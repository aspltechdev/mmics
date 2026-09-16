require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Creating/updating MMICS admin...");

  const passwordHash = await bcrypt.hash("Admin@12345", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@mmics.com",
    },

    update: {
      name: "MMICS Administrator",
      password: passwordHash,
      role: "ADMIN",
      isActive: true,
    },

    create: {
      name: "MMICS Administrator",
      email: "admin@mmics.com",
      password: passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("");
  console.log("=================================");
  console.log("MMICS ADMIN READY");
  console.log("=================================");
  console.log("ID       :", admin.id);
  console.log("Name     :", admin.name);
  console.log("Email    :", admin.email);
  console.log("Role     :", admin.role);
  console.log("Active   :", admin.isActive);
  console.log("Password : Admin@12345");
  console.log("Hash     :", admin.password);
  console.log("=================================");
}

main()
  .catch((error) => {
    console.error("");
    console.error("SEED ERROR:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });