import jwt from 'jsonwebtoken';
import { Exception } from '@/utils/errors';

export function encodeToken(data: any, secret: string, expiredIn: string | number) {
	return jwt.sign(data, secret, {
		expiresIn: expiredIn,
		algorithm: 'HS256',
	});
}

export function decodeToken(token: string) {
	return jwt.decode(token);
}

export function verifyToken(token: string, secret: string) {
	try {
		const verified = jwt.verify(token, secret);
		return verified;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError)
			throw new Exception('ExpiredToken', 'Expired token', { error: error.message });
		if (error instanceof jwt.NotBeforeError)
			throw new Exception('InvalidToken', 'Invalid token', { error: error.message });
		if (error instanceof jwt.JsonWebTokenError)
			throw new Exception('InvalidToken', 'Invalid token', { error: error.message });
		throw new Exception('InvalidToken', 'Invalid token', { error });
	}
}
