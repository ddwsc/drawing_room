import Joi from "joi";
import { IRequestSchema } from "@/interfaces/app.interface";
import { validateRequest } from "@/middlewares/app.middleware";

const signUpSchema: IRequestSchema = {
	body: Joi.object()
		.keys({
			email: Joi.string().email().required(),
			password: Joi.string().min(6).max(32).required(),
		})
		.required(),
};

export const validateSignUp = validateRequest(signUpSchema);
