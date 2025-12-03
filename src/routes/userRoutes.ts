import express from 'express';
import { updateProfile } from '../controllers/userController';

const router = express.Router();

router.put('/:id/profile', updateProfile);

export default router;
