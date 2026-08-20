import express from 'express';
import {
  createDraft,
  updateGift,
  getDraft,
  uploadPhotos,
  updatePhoto,
  reorderPhotos,
  deletePhoto,
  getPublicGift
} from '../controllers/giftController.js';

const router = express.Router();

// Draft & Management Routes
router.post('/', createDraft);
router.patch('/:id', updateGift);
router.get('/:id', getDraft);

// Photo Asset Routes
router.post('/:id/photos', uploadPhotos);
router.patch('/:id/photos/:photoId', updatePhoto);
router.put('/:id/photos/reorder', reorderPhotos);
router.delete('/:id/photos/:photoId', deletePhoto);

// Public Recipient Route
router.get('/public/:slug', getPublicGift);

export default router;
