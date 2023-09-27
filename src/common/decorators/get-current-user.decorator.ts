import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from '../../modules/core/auth/types/payload.type';

export const GetCurrentUser = createParamDecorator<
  keyof JwtPayload | 'refreshToken' | undefined,
  ExecutionContext
>((data, context) => {
  const request = context.switchToHttp().getRequest();
  const user = request.user;
  return typeof data === 'undefined' ? user : user[data];
});
