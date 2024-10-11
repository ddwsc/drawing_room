import Joi from 'joi';
import { IRequestSchema } from '@/interfaces/app.interface';
import { validateRequest } from '@/middlewares/app.middleware';

const listRoomSchema: IRequestSchema = {
	query: Joi.object()
		.keys({
			name: Joi.string().default(''),
			page: Joi.number().min(1).default(1),
			size: Joi.number().min(1).max(50).default(20),
		})
		.required(),
};

export const validateListRoom = validateRequest(listRoomSchema);
