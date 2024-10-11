import { createClient, RedisClientType } from 'redis';
import config from '@/configs/env';
const { host, port } = config.redis;

class RedisClient {
	private static instance: RedisClient;
	private client: RedisClientType;

	private constructor() {
		this.client = createClient({ socket: { host, port } });
		this.client.on('connect', () => {
			console.info('Redis connected at %s %d', host, port);
		});
		this.client.on('error', () => {
			console.error('Redis error at %s %d', host, port);
		});
	}

	public static getInstance(): RedisClient {
		if (!RedisClient.instance) {
			RedisClient.instance = new RedisClient();
		}
		return RedisClient.instance;
	}

	public connect() {
		return this.client.connect();
	}

	public select(key: string) {
		return this.client.get(key).then(value => {
			try {
				return value ? JSON.parse(value) : value;
			} catch (error) {
				return value;
			}
		});
	}

	/**
	 *
	 * @param age milliseconds
	 */
	public insert(key: string, data: any, age: number) {
		return this.client.set(key, JSON.stringify(data), {
			PX: age,
			NX: true,
		});
	}

	/**
	 *
	 * @param age milliseconds
	 */
	public update(key: string, data: any, age = 0) {
		if (age) return this.client.set(key, JSON.stringify(data), { PX: age, XX: true });
		return this.client.set(key, JSON.stringify(data), { XX: true, KEEPTTL: true });
	}

	public delete(key: string) {
		return this.client.del(key);
	}
}

export default RedisClient;
