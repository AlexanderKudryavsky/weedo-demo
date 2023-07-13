import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { User } from 'src/users/entities/user.entity';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContextHost): User => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
