import { Question } from "@/domain/forum/enterprise/entities/question";
import { Question as PrismaQuestion } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Slug } from "@/domain/forum/enterprise/entities/values-objects/slug";

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }
}
