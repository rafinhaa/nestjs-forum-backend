import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { ZodValidatePipe } from "@/infra/http/pipes/zod-validate-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { QuestionPresenter } from "../presenters/question-presenter";

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
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(
    @Query(paramsValidationPipe) params: FetchRecentQuestionsParamsSchema
  ) {
    const questions = await this.fetchRecentQuestions.execute({
      page: params.page,
      limitPerPage: params.limit,
    });

    if (questions.isLeft()) {
      throw new Error();
    }

    const result = questions.value;

    return {
      pages: result.pages,
      questions: result.questions.map(QuestionPresenter.toHTTP),
    };
  }
}
