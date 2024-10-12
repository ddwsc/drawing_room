import crypto from "crypto";

export function uuid() {
	return crypto.randomUUID();
}

export function text(size = 8) {
	return crypto.randomBytes(size).toString('hex');
}

export function nowYYYYMMDD() {
	return new Date().toISOString().split('T')[0];
}
