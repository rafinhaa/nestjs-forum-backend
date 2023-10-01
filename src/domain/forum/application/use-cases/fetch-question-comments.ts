import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { Either, right } from "@/core/either";

const DEFAULT_LIMIT = 20;

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
  limitPerPage?: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  { questionComments: QuestionComment[] }
>;

export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
    limitPerPage,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const limit = limitPerPage ?? DEFAULT_LIMIT;

    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
        limitPerPage: limit,
      });

    return right({ questionComments });
  }
}
