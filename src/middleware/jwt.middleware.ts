import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly authService: JwtService) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  async use(req: Request, res: Response, next: Function) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer', '').trim();
    console.log('token', token);
    req.token = token;
    next();
  }
}
