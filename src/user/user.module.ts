import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { TemplateModule } from 'src/template/template.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    TemplateModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
