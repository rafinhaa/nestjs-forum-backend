import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { QuestionPresenter } from "../presenters/question-presenter";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { AnswerPresenter } from "../presenters/answer-presenter";

const pageQueryParamSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/question/:questionId/answers")
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) params: PageQueryParamSchema,
    @Param("questionId") questionId: string
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      page: params.page,
      limitPerPage: params.limit,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answers = result.value.answers;

    return {
      pages: result.value.pages,
      answers: answers.map(AnswerPresenter.toHTTP),
    };
  }
}
