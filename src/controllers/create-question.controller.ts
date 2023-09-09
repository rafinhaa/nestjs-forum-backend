import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

const createQuestionBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  @Post()
  async handle(@Body() body: CreateQuestionBodySchema) {}
}
