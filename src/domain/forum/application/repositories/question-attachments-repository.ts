import { QuestionAttachment } from "../../enterprise/entities/question-attachment";

interface IQuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
  deleteManyByQuestionId(questionId: string): Promise<void>;
  createMany(attachments: QuestionAttachment[]): Promise<void>;
  deleteMany(attachments: QuestionAttachment[]): Promise<void>;
}

export abstract class QuestionAttachmentsRepository
  implements IQuestionAttachmentsRepository
{
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>;
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>;

  abstract findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]>;
  abstract deleteManyByQuestionId(questionId: string): Promise<void>;
}
