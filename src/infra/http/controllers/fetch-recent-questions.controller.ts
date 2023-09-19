import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { ZodValidatePipe } from "@/infra/http/pipes/zod-validate-pipe";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { z } from "zod";

const fetchRecentQuestionsParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

const paramsValidationPipe = new ZodValidatePipe(
  fetchRecentQuestionsParamsSchema
);

type FetchRecentQuestionsParamsSchema = z.infer<
  typeof fetchRecentQuestionsParamsSchema
>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Query(paramsValidationPipe) params: FetchRecentQuestionsParamsSchema
  ) {
    const pages = Math.ceil(
      (await this.prisma.question.count()) / params.limit
    );

    const questions = await this.prisma.question.findMany({
      take: params.limit,
      skip: (params.page - 1) * params.limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      pages,
      questions,
    };
  }
}
