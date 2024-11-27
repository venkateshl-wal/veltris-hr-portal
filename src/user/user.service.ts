import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async createToken(email: string, password: string): Promise<{ token: string; user: User }> {
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
      const userExist = await this.userModel.findOne({ email, deletedAt: null });
      return userExist || null;
    } catch (error) {
      throw new Error(`Error fetching user with email ${email}: ${error.message}`);
    }
  }

  async getUsersList(): Promise<User[]> {
    try {
      const users = await this.userModel.find({ deletedAt: null });
      return users;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve users');
    }
  }

  async createUser(user: Partial<User>): Promise<User> {
    try {
        const userExists = await this.userModel.exists({ email: user.email });
        if (userExists) {
            throw new ConflictException('User already exists. Please login');
        }
        user.password = await bcrypt.hash(user.password, 10);
        const createdUser = new this.userModel(user);
        return await createdUser.save();
    } catch (error) {
      throw error;
    }
  }
}
