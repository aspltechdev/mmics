import { z } from 'zod';

export const settingsSchema = z.object({
  companyName: z.string().optional(),
  tagline: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  googleMapsUrl: z.string().url('Invalid URL').optional(),
  facebook: z.string().url('Invalid URL').optional(),
  instagram: z.string().url('Invalid URL').optional(),
  linkedin: z.string().url('Invalid URL').optional(),
  twitter: z.string().url('Invalid URL').optional(),
  youtube: z.string().url('Invalid URL').optional(),
  footerText: z.string().optional(),
  copyright: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
});