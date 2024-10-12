import fs from 'fs';
import path from 'path';
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback, MulterError } from 'multer';
import { HttpException } from '@/utils/errors';
import { IRequest, IRequestSchema } from '@/interfaces/app.interface';
import { validateRequest } from '@/middlewares/app.middleware';
import config from '@/configs/env';

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		const fileDir = path.resolve(config.upload.dir);
		fs.mkdirSync(fileDir, { recursive: true });
		callback(null, fileDir);
	},
	filename: (req, file, callback) => {
		const _req = req as IRequest;
		callback(null, _req.request_id + path.extname(file.originalname).toLowerCase());
	},
});

const extWhitelist = ['.png', '.jpg', '.jpeg', '.gif', '.pdf'];

const mimeWhitelist = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf'];

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
	const fileExt = path.extname(file.originalname).toLowerCase();
	const fileMime = file.mimetype;
	if (extWhitelist.includes(fileExt) && mimeWhitelist.includes(fileMime)) {
		callback(null, true);
		return;
	}
	callback(new MulterError('LIMIT_UNEXPECTED_FILE'));
};

const upload = multer({
	storage,
	limits: {
		fileSize: config.upload.maxSize * 1024 * 1024,
	},
	fileFilter,
});

export function validateSingleFile(req: Request, res: Response, next: NextFunction) {
	upload.single('file')(req, res, err => {
		if (err) {
			next(new HttpException(400, 'Unsupported file'));
			return;
		}
		next();
	});
}

const createFileMessageSchema: IRequestSchema = {
	body: Joi.object()
		.keys({
			roomName: Joi.string().required(),
		})
		.required(),
};

export const validateCreateFileMessage = validateRequest(createFileMessageSchema);

