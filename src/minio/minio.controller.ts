import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';

@Controller('files')
class FilesController {
    constructor(private readonly minioService: MinioService) {}

    @Post('covers')
    @UseInterceptors(FileInterceptor('file'))
    async uploadBookCover(@UploadedFile() file: Express.Multer.File) {
        await this.minioService.createBucketIfNotExists();
        const fileName = await this.minioService.uploadFile(file);
        return fileName;
    }

    @Get('covers/:fileName')
    async getBookCover(@Param('fileName') fileName: string) {
        const fileUrl = await this.minioService.getFileUrl(fileName);
        return fileUrl;
    }

    @Delete('covers/:fileName')
    async deleteBookCover(@Param('fileName') fileName: string) {
        await this.minioService.deleteFile(fileName);
        return fileName;
    }
}
