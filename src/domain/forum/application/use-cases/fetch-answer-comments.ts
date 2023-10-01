import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { Either, right } from "@/core/either";

const DEFAULT_LIMIT = 20;

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
  limitPerPage?: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  { answerComments: AnswerComment[] }
>;

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
    limitPerPage,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const limit = limitPerPage ?? DEFAULT_LIMIT;

    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
        limitPerPage: limit,
      });

    return right({
      answerComments,
    });
  }
}
