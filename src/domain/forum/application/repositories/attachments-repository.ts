import { Attachment } from "../../enterprise/entities/attachment";

interface IAttachmentsRepository {
  create(attachment: Attachment): Promise<void>;
}

export abstract class AttachmentsRepository implements IAttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>;
}
