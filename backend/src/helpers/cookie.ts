import { CookieOptions } from 'express';
import config from '@/configs/env';

const secureOptions: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: config.env !== 'development' ? 'lax' : 'none',
};

export const accessOptions: CookieOptions = { ...secureOptions, maxAge: config.cache.userAccessExpire };

export const signInOptions: CookieOptions = { ...secureOptions, maxAge: config.cache.userSignInExpire };

export const signOutOptions: CookieOptions = { ...secureOptions, maxAge: 0 };

export function execRefreshCookie(cookieString: string) {
	return cookieString
		.split('; ')
		.find(c => c.startsWith('refreshToken='))
		?.split('=')[1];
}
