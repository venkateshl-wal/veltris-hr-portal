import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
  
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header is missing');
      }
  
      const token = authHeader.split(' ')[1]; // Extract token from Bearer <token>
      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }
  
      const user = await this.authService.validateToken(token);
      if (!user) {
        throw new UnauthorizedException('Invalid or expired token');
      }
  
      request.user = user; // Attach user to the request
      return true;
    }
  }
  