import { QuestionAttachment } from "../../enterprise/entities/question-attachment";

interface IQuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
  deleteManyByQuestionId(questionId: string): Promise<void>;
}

export abstract class QuestionAttachmentsRepository
  implements IQuestionAttachmentsRepository
{
  abstract findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]>;
  abstract deleteManyByQuestionId(questionId: string): Promise<void>;
}
