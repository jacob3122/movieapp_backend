import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';

export interface Response<T> {
  data: T;
}

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    let newToken;
    let payload;
    let fetchTokenResponse;
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();

    const [type, token] =
      (await request?.headers?.authorization?.split(' ')) ?? [];

    // { sub: '7560845849', iat: 1716400742, exp: 1716407942 }
    if (
      request.originalUrl !== '/users/signUp' &&
      request.originalUrl !== '/auth/login'
    ) {
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: 'qwertyuiop',
        });

        if (payload?.exp) {
          const currentTimeStamp = Math.floor(
            new Date().getTime() / 1000,
          ).toFixed(0);
          if (payload?.exp - Number(currentTimeStamp) < 1800) {
            newToken = await this.authService.signIn({ phNumber: payload.sub });

            await this.authService.updateToken(
              newToken?.access_token,
              payload.sub,
            );
          }
        }
      } catch {
        throw new UnauthorizedException();
      }
    }

    return next.handle().pipe(
      map(async (data) => {
        if (data?.data?.access_token) {
          response.header('Token', data?.data?.access_token);
          data.access_token = '';
          // data.data['access_token'] = '';
        } else {
          if (newToken?.data?.access_token === undefined) {
            fetchTokenResponse = await this.authService.fetchToken(
              payload?.sub,
            );
          }
          response.header(
            'Token',
            newToken?.data?.access_token ?? fetchTokenResponse,
          );
        }

        return data;
      }),
    );
  }
}
