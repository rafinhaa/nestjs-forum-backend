import { Either, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";

const DEFAULT_LIMIT = 20;

interface FetchRecentQuestionsCaseRequest {
  page: number;
  limitPerPage?: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  { questions: Question[] }
>;

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
    limitPerPage,
  }: FetchRecentQuestionsCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const limit = limitPerPage ?? DEFAULT_LIMIT;

    const questions = await this.questionsRepository.findManyRecent({
      page,
      limitPerPage: limit,
    });

    return right({ questions });
  }
}
