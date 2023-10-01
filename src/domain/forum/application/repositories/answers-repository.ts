import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

interface IAnswersRepository {
  findById(id: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]>;
  create(answer: Answer): Promise<void>;
  save(answer: Answer): Promise<void>;
  delete(answer: Answer): Promise<void>;
  getPages(params: PaginationParams): Promise<number>;
}

export abstract class AnswersRepository implements IAnswersRepository {
  abstract findById(id: string): Promise<Answer | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]>;
  abstract create(answer: Answer): Promise<void>;
  abstract save(answer: Answer): Promise<void>;
  abstract delete(answer: Answer): Promise<void>;
  abstract getPages(params: PaginationParams): Promise<number>;
}
