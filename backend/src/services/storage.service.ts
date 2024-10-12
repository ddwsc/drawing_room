import fs from 'fs';
import path from 'path';
import GcpStorage from "@/libs/gcpStorage";
import config from '@/configs/env';
import { nowYYYYMMDD } from '@/utils/generators';

let bucket: GcpStorage;

if (config.gcp.keyFile && config.gcp.bucketName)  bucket = GcpStorage.getInstance();

export function bucketFilePath(source: string) {
	const filename = path.basename(source);
	const now = nowYYYYMMDD();
	return path.join(now, filename);
}

export function localFilePath(filename: string) {
	return path.resolve(config.upload.dir, filename);
}

export function upload(source: string, destination?: string) {
	if (!fs.existsSync(source)) return Promise.reject(new Error('Source not found'));
	if (bucket) {
		if (!destination) destination = bucketFilePath(source);
		return bucket.upload(source, destination);
	}
	return Promise.resolve(destination);
}

export function download(source: string, destination?: string) {
	const filename = path.basename(source);
	if (!destination) destination = localFilePath(filename);
	if (!fs.existsSync(destination)) {
		if (bucket) {
			return bucket.download(source, destination);
		}
	}
	return Promise.resolve(destination);
}
