import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Template extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  templateurl: string;

  @Prop()
  createdAt: Date;

  @Prop()
  createdBy: number;

  @Prop()
  updatedAt: Date;

  @Prop()
  updatedBy: number;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ default: null })
  deletedBy: number;
}
export const TemplateSchema = SchemaFactory.createForClass(Template);
