import RedisClient from "@/libs/redis";
import config from '@/configs/env';

export const cacheClient = RedisClient.getInstance();

export function select(key: string) {
	return cacheClient.select(key);
}

export function remove(key: string) {
	return cacheClient.delete(key);
}

export function insertUserSignIn(key: string, data: any) {
	return cacheClient.insert(key, data, config.cache.userSignInExpire);
}
