import { Either, right } from "@/core/either";
import { AnswersRepository } from "../repositories//answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

const DEFAULT_LIMIT = 20;

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string;
  page: number;
  limitPerPage?: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
    limitPerPage = DEFAULT_LIMIT,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
        limitPerPage,
      }
    );

    return right({
      answers,
    });
  }
}
