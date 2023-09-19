import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { compare } from "bcryptjs";
import { z } from "zod";
import { ZodValidatePipe } from "@/infra/http/pipes/zod-validate-pipe";
import { JwtService } from "@nestjs/jwt";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(
    private readonly Jwt: JwtService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  @UsePipes(new ZodValidatePipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = this.Jwt.sign({
      sub: user.id,
    });

    return { accessToken };
  }
}
