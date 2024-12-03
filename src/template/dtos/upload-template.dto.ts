import { IsNotEmpty, IsString } from 'class-validator';

export class UploadTemplateDto {
  @IsString()
  @IsNotEmpty({ message: 'Template name is required' })
  readonly name: string;

  @IsString()
  @IsNotEmpty({ message: 'Template version is required' })
  readonly version: string;

}
