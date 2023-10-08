import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

interface IAnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>;
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>;
  findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>;
  create(answerComment: AnswerComment): Promise<void>;
  delete(answerComment: AnswerComment): Promise<void>;
  getPages(params: PaginationParams): Promise<number>;
}

export abstract class AnswerCommentsRepository
  implements IAnswerCommentsRepository
{
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>;
  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>;
  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
  abstract getPages(params: PaginationParams): Promise<number>;
}
