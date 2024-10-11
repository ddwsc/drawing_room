import { Request, Response, NextFunction } from 'express';
import { IRequest } from '@/interfaces/app.interface';

export default async function authAccess(req: Request, res: Response, next: NextFunction) {
	const _req = req as IRequest;
	const LABEL = { label: _req.request_id };
	try {
		const currentUser = _req.current_user;
		res.json({ email: currentUser.email });
	} catch (error: any) {
		next(error);
	}
}
