import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidatePipe } from "@/infra/http/pipes/zod-validate-pipe";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { WrongCredentialError } from "@/domain/forum/application/use-cases/errors/wrong-credential-error";
import { Public } from "@/infra/auth/public";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
@Public()
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
      const error = student.value;
      switch (error.constructor) {
        case WrongCredentialError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return { accessToken: student.value.accessToken };
  }
}
