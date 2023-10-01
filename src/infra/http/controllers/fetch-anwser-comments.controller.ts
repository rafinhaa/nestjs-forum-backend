import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageQueryParamSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/answer/:answerId/comments")
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) params: PageQueryParamSchema,
    @Param("answerId") answerId: string
  ) {
    const result = await this.fetchAnswerComments.execute({
      page: params.page,
      limitPerPage: params.limit,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.answerComments;

    return {
      pages: result.value.pages,
      comments: comments.map(CommentPresenter.toHTTP),
    };
  }
}
