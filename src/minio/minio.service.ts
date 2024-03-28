import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
    private minioClient: Minio.Client;
    private bucketName: string;

    constructor() {
        this.minioClient = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT,
            port: +process.env.MINIO_PORT,
            useSSL: process.env.MINIO_USE_SSL === 'true',
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
        });
        this.bucketName = process.env.MINIO_BUCKET_NAME;
        this.createBucketIfNotExists()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .then((value) => undefined)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch((err) => undefined);
    }

    getBucketUrl() {
        const proto = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
        return `${proto}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${this.bucketName}`;
    }

    async createBucketIfNotExists() {
        const bucketExists = await this.minioClient.bucketExists(this.bucketName);
        if (!bucketExists) {
            await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
            await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(getBucketPolicy(this.bucketName)));
        }

        return true;
    }

    async uploadFile(file: Express.Multer.File) {
        const fileName = `${Date.now()}-${file.originalname}`;
        await this.minioClient.putObject(this.bucketName, fileName, file.buffer, file.size);

        return `${this.getBucketUrl()}/${fileName}`;
    }

    async getFileUrl(fileName: string) {
        return await this.minioClient.presignedUrl('GET', this.bucketName, fileName);
    }

    async deleteFile(fileName: string) {
        await this.minioClient.removeObject(this.bucketName, fileName);
    }
}

function getBucketPolicy(name: string) {
    return {
        Statement: [
            {
                Action: ['s3:GetBucketLocation', 's3:ListBucket'],
                Effect: 'Allow',
                Principal: {
                    AWS: ['*'],
                },
                Resource: [`arn:aws:s3:::${name}`],
            },
            {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: {
                    AWS: ['*'],
                },
                Resource: [`arn:aws:s3:::${name}/*`],
            },
        ],
        Version: '2012-10-17',
    };
}
