import { Either, right } from "@/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";

const DEFAULT_LIMIT = 20;

interface FetchAnswerCommentsCaseRequest {
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
  }: FetchAnswerCommentsCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const limit = limitPerPage ?? DEFAULT_LIMIT;

    const answerComments =
      await this.answerCommentsRepository.findManyByQuestionId(answerId, {
        page,
        limitPerPage: limit,
      });

    return right({ answerComments });
  }
}
