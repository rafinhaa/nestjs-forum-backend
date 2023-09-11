import { Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt-strategy.module";

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  @Post()
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user);
  }
}
