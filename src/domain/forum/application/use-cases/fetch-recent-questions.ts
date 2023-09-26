import { Either, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Injectable } from "@nestjs/common";

const DEFAULT_LIMIT = 20;

interface FetchRecentQuestionsCaseRequest {
  page: number;
  limitPerPage?: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  { questions: Question[]; pages: number }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
    limitPerPage = DEFAULT_LIMIT,
  }: FetchRecentQuestionsCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const pages = await this.questionsRepository.getPages({
      limitPerPage,
    });

    const questions = await this.questionsRepository.findManyRecent({
      page,
      limitPerPage,
    });

    return right({ questions, pages });
  }
}
