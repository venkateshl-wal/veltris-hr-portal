import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  gender: string;

  @Prop()
  photo?: string;

  @Prop({ required: true })
  password: string;

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
export const UserSchema = SchemaFactory.createForClass(User);
