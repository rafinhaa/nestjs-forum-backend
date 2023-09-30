import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Prisma, Answer as PrismaAnswer } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: raw.content,
        questionId: new UniqueEntityID(raw.questionId),
        authorId: new UniqueEntityID(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      questionId: answer.questionId.toString(),
      content: answer.content,
      authorId: answer.authorId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    };
  }
}
