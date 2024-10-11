import Joi from 'joi';
import { IRequestSchema } from '@/interfaces/app.interface';
import { validateRequest } from '@/middlewares/app.middleware';

const createMessageSchema: IRequestSchema = {
	body: Joi.object()
		.keys({
			roomName: Joi.string().required(),
			content: Joi.string().required(),
		})
		.required(),
};

export const validateCreateMessage = validateRequest(createMessageSchema);
