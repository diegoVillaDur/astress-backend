import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Úsalo como @CurrentUser() user en los controllers para obtener el usuario del JWT
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
