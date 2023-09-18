import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  async findById(id: string): Promise<QuestionComment | null> {
    const item = this.items.find((item) => item.id.toString() === id);
    return item || null;
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((comments) => comments.questionId.toString() === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(
        (params.page - 1) * params.limitPerPage,
        params.page * params.limitPerPage
      );

    return questionComments;
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async delete(questionComment: QuestionComment) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === questionComment.id.toString()
    );
    this.items.splice(index, 1);
  }
}
