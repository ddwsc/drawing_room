import crypto from 'crypto';

export function hashPassword(plainPassword: string, salt: string) {
	return crypto.createHash('sha256').update(plainPassword + salt).digest('hex');
}
