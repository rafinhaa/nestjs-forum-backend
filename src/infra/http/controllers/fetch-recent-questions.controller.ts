import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query(queryValidationPipe) params: PageQueryParamSchema) {
    const result = await this.fetchRecentQuestions.execute({
      page: params.page,
      limitPerPage: params.limit,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const questions = result.value.questions;

    return {
      pages: result.value.pages,
      questions: questions.map(QuestionPresenter.toHTTP),
    };
  }
}
