import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR'
};

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['products', 'categories', 'enquiries', 'directors', 'gallery', 'news', 'testimonials'],
  EDITOR: ['products', 'categories', 'news', 'gallery']
};