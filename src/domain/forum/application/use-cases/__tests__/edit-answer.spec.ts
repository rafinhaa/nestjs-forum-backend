import { EditAnswerUseCase } from "../edit-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "test/factories/make-answer-attachments";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository
    );

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswersAttachmentsRepository
    );
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityID("answer-1"));

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswersAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("attachment-1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("attachment-2"),
      })
    );

    await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: newAnswer.authorId.toValue(),
      content: "Conteúdo teste",
      attachmentsIds: ["attachment-1", "attachment-3"],
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "Conteúdo teste",
    });

    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({
          attachmentId: new UniqueEntityID("attachment-1"),
          answerId: newAnswer.id,
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("attachment-3"),
          answerId: newAnswer.id,
        }),
      ]
    );
  });

  it("should not be able to edit a answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: "author-2",
      content: "Conteúdo teste",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should be not find a answer", async () => {
    const result = await sut.execute({
      answerId: "answer-1",
      authorId: "author-2",
      content: "Conteúdo teste",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
