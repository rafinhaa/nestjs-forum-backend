import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { AnswerPresenter } from "../presenters/answer-presenter";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageQueryParamSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/question/:questionId/comments")
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) params: PageQueryParamSchema,
    @Param("questionId") questionId: string
  ) {
    const result = await this.fetchQuestionComments.execute({
      page: params.page,
      limitPerPage: params.limit,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.questionComments;

    return {
      pages: result.value.pages,
      comments: comments.map(CommentPresenter.toHTTP),
    };
  }
}
