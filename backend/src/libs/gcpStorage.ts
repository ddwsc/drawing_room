import { Storage, Bucket } from '@google-cloud/storage';
import config from "@/configs/env";

class GcpStorage {
  private static instance: GcpStorage;
  private bucket: Bucket;

  private constructor() {
    const storage = new Storage({ keyFilename: config.gcp.keyFile });
	this.bucket = storage.bucket(config.gcp.bucketName);
  }

  public static getInstance(): GcpStorage {
    if (!GcpStorage.instance) {
		GcpStorage.instance = new GcpStorage();
    }
    return GcpStorage.instance;
  }

  public upload(source: string, destination: string) {
	return this.bucket.upload(source, { destination });
  }

  public download(source: string, destination: string) {
	return this.bucket.file(source).download({ destination });
  }
}

export default GcpStorage;
