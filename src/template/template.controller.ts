import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemplate(
    @UploadedFile() file: Express.Multer.File,
    @Body('version') version: string,
  ) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const templateDetails = await this.templateService.insertTemplate(
        version,
        file,
      );
      return { message: 'File uploaded successfully', templateDetails };
    } catch (error) {
      throw new HttpException(
        `Upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @UseGuards(AuthGuard)
  @Get()
  async getTemplatesList() {
    try {
      return await this.templateService.getTemplatesList();
    } catch (error) {
      throw new HttpException(
        `File retrieval failed: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
