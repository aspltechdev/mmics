import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  material: z.string().optional(),
  specifications: z.record(z.any()).optional(),
  applications: z.array(z.string()).optional(),
  moq: z.string().optional(),
  customization: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const productUpdateSchema = productSchema.partial();