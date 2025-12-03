import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { processImage, validateAudio } from '../services/mediaService';

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../../uploads') });

router.post('/upload/image', upload.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const result = await processImage(req.file);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/upload/audio', upload.single('audio'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        validateAudio(req.file);

        // In real app, upload to S3/GCS here
        res.json({ success: true, filename: req.file.filename });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
