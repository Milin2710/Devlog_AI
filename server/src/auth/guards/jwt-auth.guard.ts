import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    try {
      const token = request.cookies['auth-token'];
      if (!token) return false;
      
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      
      return true;
    } catch (error) {
      return false;
    }
  }
}
