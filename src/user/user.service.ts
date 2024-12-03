import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TemplateService } from 'src/template/template.service';
import { ChangePasswordDto } from './dtos/changePassword.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
    private readonly templateService: TemplateService,
  ) {}

  async createToken(
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    try {
      const user = await this.findUser(email);
      if (!user) {
        throw new BadRequestException('User not exists. Please Register');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }

      const payload = { sub: user._id, email: user.email };
      const token = await this.jwtService.signAsync(payload);

      return { token, user };
    } catch (error) {
      throw error;
    }
  }

  async findUser(email: string): Promise<User | null> {
    try {
      const userExist = await this.userModel.findOne({
        email,
        deletedAt: null,
      });
      return userExist || null;
    } catch (error) {
      throw new Error(
        `Error fetching user with email ${email}: ${error.message}`,
      );
    }
  }

  async getUsersList(): Promise<User[]> {
    try {
      return await this.userModel.find(
        { deletedAt: null, deletedBy: null },
        { password: 0 },
      );
    } catch (error) {
      throw new BadRequestException('Failed to retrieve users');
    }
  }

  async createUser(
    user: Partial<User>,
    photo?: Express.Multer.File,
  ): Promise<User> {
    try {
      const userExists = await this.userModel.exists({ email: user.email });
      if (userExists) {
        throw new ConflictException('User already exists. Please login');
      }
      user.password = await bcrypt.hash(user.password, 10);
      const photoUrl = photo
        ? await this.templateService.uploadFile(photo)
        : null;
      const newUser = { ...user, photo: photoUrl };
      const createdUser = new this.userModel(newUser);
      return await createdUser.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create user: ${error.message}`,
      );
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<Object> {
    try {
      const { userId, oldPassword, newPassword } = changePasswordDto;
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Old password is incorrect');
      }
      const hasedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hasedPassword;
      await user.save();
      return { message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }
}
