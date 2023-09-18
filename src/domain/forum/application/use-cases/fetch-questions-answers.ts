import { Either, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";

const DEFAULT_LIMIT = 20;

interface FetchQuestionsAnswersCaseRequest {
  questionId: string;
  page: number;
  limitPerPage?: number;
}

type FetchQuestionsAnswersUseCaseResponse = Either<null, { answers: Answer[] }>;

export class FetchQuestionsAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
    limitPerPage,
  }: FetchQuestionsAnswersCaseRequest): Promise<FetchQuestionsAnswersUseCaseResponse> {
    const limit = limitPerPage ?? DEFAULT_LIMIT;

    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
        limitPerPage: limit,
      }
    );

    return right({ answers });
  }
}
