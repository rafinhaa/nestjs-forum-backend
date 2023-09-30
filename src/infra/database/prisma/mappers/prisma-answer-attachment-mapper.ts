import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Attachment as PrismaAttachment } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error("answerId is required");
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        answerId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id)
    );
  }
}