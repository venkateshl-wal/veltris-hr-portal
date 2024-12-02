import { forwardRef, Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateSchema } from 'src/schemas/template.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: 'Template', schema: TemplateSchema }]),
  ],
  providers: [TemplateService],
  controllers: [TemplateController],
  exports: [TemplateService],
})
export class TemplateModule {}
