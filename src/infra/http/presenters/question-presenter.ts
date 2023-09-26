import { Question } from "@/domain/forum/enterprise/entities/question";

export class QuestionPresenter {
  static toHTTP(question: Question) {
    console.log(question);
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId?.toString() || null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
