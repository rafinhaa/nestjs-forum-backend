import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";

const DEFAULT_LIMIT = 20;

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
  limitPerPage?: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  { pages: number; answerComments: AnswerComment[] }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
    limitPerPage = DEFAULT_LIMIT,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const pages = await this.answerCommentsRepository.getPages({
      limitPerPage,
      page,
    });

    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
        limitPerPage,
      });

    return right({
      pages,
      answerComments,
    });
  }
}
