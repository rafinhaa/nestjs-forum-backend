import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Either, left, right } from "@/core/either";

interface GetQuestionsBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionsBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  { question: Question }
>;
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionsBySlugUseCaseRequest): Promise<GetQuestionsBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError("Question not found"));
    }

    return right({ question });
  }
}
