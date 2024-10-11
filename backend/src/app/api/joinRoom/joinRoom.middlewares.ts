import Joi from 'joi';
import { IRequestSchema } from '@/interfaces/app.interface';
import { validateRequest } from '@/middlewares/app.middleware';

const joinRoomSchema: IRequestSchema = {
	params: Joi.object()
		.keys({
			roomName: Joi.string().required()
		})
		.required(),
};

export const validateJoinRoom = validateRequest(joinRoomSchema);
