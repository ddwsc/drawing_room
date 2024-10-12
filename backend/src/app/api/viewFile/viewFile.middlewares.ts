import Joi from 'joi';
import { IRequestSchema } from '@/interfaces/app.interface';
import { validateRequest } from '@/middlewares/app.middleware';

const viewFileSchema: IRequestSchema = {
	params: Joi.object()
		.keys({
			title: Joi.string().required(),
		})
		.required(),
};

export const validateViewFile = validateRequest(viewFileSchema);

