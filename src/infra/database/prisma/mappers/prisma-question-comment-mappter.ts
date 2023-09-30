import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Prisma, Comment as PrismaComment } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error("questionId is required");
    }

    return QuestionComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    questionComment: QuestionComment
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      content: questionComment.content,
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    };
  }
}
