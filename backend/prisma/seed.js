/**
 * =========================================================
 * DATABASE SEED
 * =========================================================
 *
 * Run with:  npm run db:seed
 *
 * Creates the first SUPER_ADMIN, a sample member so the
 * member portal can be tested immediately, default site
 * settings and hero content, and a couple of starter
 * categories.
 *
 * Safe to run repeatedly: every write is an upsert or is
 * guarded by an existence check.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const log = (message) => console.log(`  ${message}`);

const seedAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@mmmicslimited.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'SecurePassword123!';

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'MMMICS Administrator',
      email,
      password: await bcrypt.hash(password, 10),
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  log(`admin ready:  ${admin.email}`);
  return admin;
};

const seedMember = async () => {
  const email = (process.env.DEMO_MEMBER_EMAIL || 'member@mmmicslimited.com').toLowerCase();
  const password = process.env.DEMO_MEMBER_PASSWORD || 'MemberPass123!';

  const existing = await prisma.member.findUnique({ where: { email } });

  if (existing) {
    log(`member ready: ${existing.email}`);
    return existing;
  }

  const member = await prisma.member.create({
    data: {
      membershipNumber: `MEM-${new Date().getFullYear()}-0001`,
      name: 'Demo Member',
      email,
      password: await bcrypt.hash(password, 10),
      phone: '+91 98765 43210',
      address: 'Kadavanthara, Ernakulam, Kerala',
      membershipType: 'Regular',
      isActive: true,
    },
  });

  log(`member ready: ${member.email} (${member.membershipNumber})`);
  return member;
};

const seedSettings = async () => {
  const existing = await prisma.siteSettings.findFirst();

  if (existing) {
    log('site settings already present');
    return existing;
  }

  const settings = await prisma.siteSettings.create({
    data: {
      companyName: process.env.COMPANY_NAME || 'MMMICS Limited',
      tagline: 'Packaging Solutions for MSMEs',
      email: process.env.COMPANY_EMAIL || 'info@mmmicslimited.com',
      phone: process.env.COMPANY_PHONE || '0484 265 4871',
      address: process.env.COMPANY_ADDRESS || 'Kadavanthara, Ernakulam, Kerala',
    },
  });

  log('site settings created');
  return settings;
};

const seedHero = async () => {
  const existing = await prisma.hero.findFirst();

  if (existing) {
    log('hero already present');
    return existing;
  }

  const hero = await prisma.hero.create({ data: {} });
  log('hero created');
  return hero;
};

const seedCategories = async () => {
  const categories = [
    {
      name: 'Corrugated Boxes',
      slug: 'corrugated-boxes',
      description: 'Durable corrugated packaging for shipping and storage.',
      sortOrder: 1,
    },
    {
      name: 'Paper Bags',
      slug: 'paper-bags',
      description: 'Eco-friendly paper carry bags in a range of sizes.',
      sortOrder: 2,
    },
    {
      name: 'Custom Packaging',
      slug: 'custom-packaging',
      description: 'Bespoke packaging designed around your product.',
      sortOrder: 3,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: { ...category, isActive: true },
    });
  }

  log(`categories ready: ${categories.length}`);
};

const main = async () => {
  console.log('\nSeeding MMMICS database\n');

  await seedAdmin();
  await seedMember();
  await seedSettings();
  await seedHero();
  await seedCategories();

  console.log('\nSeed complete.\n');
  console.log('  Admin portal   ->  /login');
  console.log('  Member portal  ->  /member/login\n');
};

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
