import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use a strong secret
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME }, // Token expiration time
    }),
  ],
  providers: [AuthService, AuthGuard], // Include AuthService and Guard
  exports: [AuthService, JwtModule],   // Export AuthService and JwtModule for use in other modules
})
export class AuthModule {}
