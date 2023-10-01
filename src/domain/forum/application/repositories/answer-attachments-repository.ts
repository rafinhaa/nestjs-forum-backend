import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

interface IAnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  deleteManyByAnswerId(answerId: string): Promise<void>;
}

export abstract class AnswerAttachmentsRepository
  implements IAnswerAttachmentsRepository
{
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  abstract deleteManyByAnswerId(answerId: string): Promise<void>;
}
