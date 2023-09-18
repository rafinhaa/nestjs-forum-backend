import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answers-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async findById(answerId: string): Promise<Answer | null> {
    return (
      this.items.find((answer) => answer.id.toString() === answerId) ?? null
    );
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((answer) => answer.questionId.toString() === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(
        (params.page - 1) * params.limitPerPage,
        params.page * params.limitPerPage
      );

    return answers;
  }

  async save(answer: Answer) {
    const index = this.items.findIndex((a) => a.id === answer.id);
    this.items[index] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer) {
    const index = this.items.findIndex((a) => a.id === answer.id);
    this.items.splice(index, 1);
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }
}
