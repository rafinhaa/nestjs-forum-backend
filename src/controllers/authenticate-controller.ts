import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidatePipe } from "src/pipes/zod-validate-pipe";
import { JwtService } from "@nestjs/jwt";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private readonly Jwt: JwtService) {}

  @Post()
  // @HttpCode(201)
  // @UsePipes(new ZodValidatePipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const token = await this.Jwt.sign({
      sub: "oi",
    });

    return token;
  }
}
