import express from 'express';
import {
  submitContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
} from '../controllers/contactController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), getContacts);
router.get('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), getContactById);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateContact);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteContact);

export default router;