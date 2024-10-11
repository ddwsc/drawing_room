import { encodeToken, verifyToken } from "@/helpers/token";
import config from "@/configs/env";

export function verify(token: string) {
	return verifyToken(token, config.token.secret);
}

export function accessToken() {
	return encodeToken({}, config.token.secret, config.token.accessExpire);
}

export function refreshToken() {
	return encodeToken({}, config.token.secret, config.token.refreshExpire);
}

export function verifyEmailToken(email: string) {
	return encodeToken(
		{ iam: email },
		config.token.secret,
		config.token.verifyEmailExpire
	);
}

export function resetPasswordToken(email: string) {
	return encodeToken(
		{ iam: email },
		config.token.secret,
		config.token.resetPasswordExpire
	);
}
