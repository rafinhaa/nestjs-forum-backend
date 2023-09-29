import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidatePipe } from "@/infra/http/pipes/zod-validate-pipe";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(
    private readonly authenticateStudentUseCase: AuthenticateStudentUseCase
  ) {}

  @Post()
  @UsePipes(new ZodValidatePipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const student = await this.authenticateStudentUseCase.execute({
      email,
      password,
    });

    if (student.isLeft()) {
      throw new Error();
    }

    return { accessToken: student.value.accessToken };
  }
}
