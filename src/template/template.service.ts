import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { s3Config } from './config/s3-config';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from 'src/schemas/template.schema';
import { Model } from 'mongoose';

@Injectable()
export class TemplateService {
  private s3 = s3Config;
  constructor(
    @InjectModel(Template.name) private templateModel: Model<Template>,
  ) {}
  private generateFileKey(fileName: string): string {
    return `templates/${Date.now()}-${fileName}`;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = this.generateFileKey(file.originalname);
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const uploadResult = await this.s3.upload(s3Params).promise();
      return uploadResult.Location;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to upload file: ${error.message}`,
      );
    }
  }

  async insertTemplate(version, file: Express.Multer.File): Promise<Template> {
    if (!file) {
      throw new InternalServerErrorException(
        'File is required to insert a template.',
      );
    }
    try {
      const templateURL = await this.uploadFile(file);

      const templateParam = {
        name: file.originalname,
        version: version,
        templateurl: templateURL,
      };
      return await this.templateModel.create(templateParam);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to insert template: ${error.message}`,
      );
    }
  }

  async getTemplatesList(): Promise<Template[]> {
    try {
      return await this.templateModel.find({
        deletedAt: null,
        deletedBy: null,
      });
    } catch (error) {
      throw new BadRequestException('Failed to retrieve templates');
    }
  }
}
