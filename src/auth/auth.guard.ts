import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { ParsedCookiesPayload } from './parsed-cookies-payload.interface';
import { MainServiceApiClient } from '../main-service/main-service.api-client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly mainServiceApiClient: MainServiceApiClient) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookies = request.cookies as ParsedCookiesPayload;

    if (!cookies.Auth) {
      throw new UnauthorizedException(
        'Please log in in order to continue using this API'
      );
    }

    const { user } = await this.mainServiceApiClient.findUserInfoByAccessToken(
      cookies.Auth
    );

    request.user = user;
    request.accessToken = cookies.Auth;

    return true;
  }
}
