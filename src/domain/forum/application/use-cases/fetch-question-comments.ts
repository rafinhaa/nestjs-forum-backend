import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";

const DEFAULT_LIMIT = 20;

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
  limitPerPage?: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  { pages: number; questionComments: QuestionComment[] }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
    limitPerPage = DEFAULT_LIMIT,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const pages = await this.questionCommentsRepository.getPages({
      limitPerPage,
      page,
    });

    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
        limitPerPage,
      });

    return right({ pages, questionComments });
  }
}
