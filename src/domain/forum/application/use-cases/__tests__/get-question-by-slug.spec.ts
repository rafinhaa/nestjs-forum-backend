import { GetQuestionBySlugUseCase } from "../get-question-by-slug";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";
import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestionAttachment } from "test/factories/make-question-attachments";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const student = makeStudent();

    await inMemoryStudentsRepository.create(student);

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create("example-question"),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const attachment = makeAttachment();

    inMemoryAttachmentsRepository.items.push(attachment);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      })
    );

    const result = await sut.execute({
      slug: newQuestion.slug.value,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value).toMatchObject({
        question: expect.objectContaining({
          title: newQuestion.title,
          author: student.name,
          attachments: [
            expect.objectContaining({
              title: attachment.title,
            }),
          ],
        }),
      });
    }
  });

  it("should not be able to get a question by slug", async () => {
    const result = await sut.execute({ slug: "example-question" });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
