import { Either, right } from "@/core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";

const DEFAULT_LIMIT = 20;

interface FetchQuestionsCommentsCaseRequest {
  questionId: string;
  page: number;
  limitPerPage?: number;
}

type FetchQuestionsCommentsUseCaseResponse = Either<
  null,
  { questionComments: QuestionComment[] }
>;

export class FetchQuestionsCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
    limitPerPage,
  }: FetchQuestionsCommentsCaseRequest): Promise<FetchQuestionsCommentsUseCaseResponse> {
    const limit = limitPerPage ?? DEFAULT_LIMIT;

    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
        limitPerPage: limit,
      });

    return right({ questionComments });
  }
}
