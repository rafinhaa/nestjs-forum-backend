import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  async findById(id: string): Promise<AnswerComment | null> {
    const item = this.items.find((item) => item.id.toString() === id);
    return item || null;
  }

  async findManyByQuestionId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((comments) => comments.answerId.toString() === answerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(
        (params.page - 1) * params.limitPerPage,
        params.page * params.limitPerPage
      );

    return answerComments;
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }

  async delete(answerComment: AnswerComment) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === answerComment.id.toString()
    );
    this.items.splice(index, 1);
  }
}
