import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserPayload } from "./jwt-strategy.module";

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) =>
    context.switchToHttp().getRequest().user as UserPayload
);
