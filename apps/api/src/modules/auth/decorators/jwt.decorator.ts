import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@repo/shared';

export const Jwt = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return null;
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);
