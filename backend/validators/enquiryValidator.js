import { z } from 'zod';

export const enquirySchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  company: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  quantity: z.string().optional(),
  requirements: z.string().optional(),
  message: z.string().optional()
});

export const enquiryUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'QUOTED', 'CONVERTED', 'CLOSED']).optional(),
  assignedToId: z.string().optional(),
  internalNotes: z.string().optional()
});