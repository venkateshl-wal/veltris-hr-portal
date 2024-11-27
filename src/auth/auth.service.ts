import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded; // Return decoded payload
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
