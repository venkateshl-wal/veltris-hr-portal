import { Body, Controller, Get, Post, Query, Res, BadRequestException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

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
    @Res() res: Response
  ) {
    try {
      const { token, user } = await this.userService.createToken(email, password);

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
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw error
    }
  }
}
