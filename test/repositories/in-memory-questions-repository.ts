import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async findById(questionId: string): Promise<Question | null> {
    return (
      this.items.find((question) => question.id.toString() === questionId) ??
      null
    );
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this.items.find((question) => question.slug.value === slug) ?? null;
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(
        (params.page - 1) * params.limitPerPage,
        params.page * params.limitPerPage
      );

    return questions;
  }

  async save(question: Question) {
    const index = this.items.findIndex((q) => q.id === question.id);
    this.items[index] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async create(question: Question) {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question) {
    const index = this.items.findIndex((q) => q.id === question.id);
    this.items.splice(index, 1);
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }
}
