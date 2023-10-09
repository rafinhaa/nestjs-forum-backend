import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { FetchAnswerCommentsUseCase } from "../fetch-answer-comments";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

const ANSWER1_ID = new UniqueEntityID("answer-1");

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeAnswerComment({
      createdAt: new Date(2023, 0, 20),
      answerId: ANSWER1_ID,
      authorId: student.id,
    });
    const comment2 = makeAnswerComment({
      createdAt: new Date(2023, 0, 18),
      answerId: ANSWER1_ID,
      authorId: student.id,
    });
    const comment3 = makeAnswerComment({
      createdAt: new Date(2023, 0, 23),
      answerId: ANSWER1_ID,
      authorId: student.id,
    });

    await inMemoryAnswerCommentsRepository.create(comment1);
    await inMemoryAnswerCommentsRepository.create(comment2);
    await inMemoryAnswerCommentsRepository.create(comment3);

    const result = await sut.execute({
      answerId: ANSWER1_ID.toString(),
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual([
      expect.objectContaining({
        createdAt: new Date(2023, 0, 23),
        commentId: comment3.id,
        author: student.name,
        content: comment3.content,
        updatedAt: comment3.updatedAt,
        authorId: student.id,
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 20),
        commentId: comment1.id,
        author: student.name,
        content: comment1.content,
        updatedAt: comment1.updatedAt,
        authorId: student.id,
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 18),
        commentId: comment2.id,
        author: student.name,
        content: comment2.content,
        updatedAt: comment2.updatedAt,
        authorId: student.id,
      }),
    ]);
  });

  it("should be able to fetch paginate answer comments", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          createdAt: new Date(2023, 0, i),
          answerId: ANSWER1_ID,
          authorId: student.id,
        })
      );
    }
    const result = await sut.execute({
      answerId: ANSWER1_ID.toString(),
      page: 1,
    });

    expect(result.value?.comments.length).toEqual(20);
  });

  it("should be able to fetch paginate answer comments with limit", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i < 10; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          createdAt: new Date(2023, 0, i),
          answerId: ANSWER1_ID,
          authorId: student.id,
        })
      );
    }
    const result = await sut.execute({
      answerId: ANSWER1_ID.toString(),
      page: 1,
      limitPerPage: 5,
    });

    expect(result.value?.comments.length).toEqual(5);
  });
});
