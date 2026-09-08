import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetRawHeaders = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {
        // console.log({ data });

        const req = ctx.switchToHttp().getRequest();
        const rawHeaders = req.rawHeaders;
        // console.log({rawHeaders});

        return rawHeaders;
    }
);