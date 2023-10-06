import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error("questionId is required");
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrismaUpdateMany(
    raw: QuestionAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {
    return {
      where: {
        id: {
          in: raw.map((a) => a.attachmentId.toString()),
        },
      },
      data: {
        questionId: raw[0].questionId.toString(),
      },
    };
  }
}
