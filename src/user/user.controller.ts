import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  BadRequestException,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDto } from './dtos/changePassword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUsersList() {
    try {
      return await this.userService.getUsersList();
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }

  @Post('login')
  async login(
    @Query('email') email: string,
    @Query('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const { token, user } = await this.userService.createToken(
        email,
        password,
      );

      // Set token in response headers
      res.setHeader('Authorization', `Bearer ${token}`);
      res.setHeader('Access-Control-Expose-Headers', 'Authorization');

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    try {
      const userDetails = await this.userService.createUser(
        createUserDto,
        photo,
      );
      return { message: 'User created successfully', userDetails };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    try {
      return await this.userService.changePassword(changePasswordDto);
    } catch (error) {
      throw error;
    }
  }
}
