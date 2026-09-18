const bcrypt = require("bcryptjs");
const prisma = require("./src/config/database");

const createAdmin = async () => {
  try {
    const email = "admin@mmics.com";
    const password = "Admin@12345";

    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("User already exists:", existingAdmin.email);
      console.log("Existing role:", existingAdmin.role);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        name: "MMICS Admin",
        email,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", admin.role);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();
