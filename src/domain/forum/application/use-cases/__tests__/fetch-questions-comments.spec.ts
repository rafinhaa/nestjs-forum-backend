import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "../fetch-question-comments";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

const QUESTION1_ID = new UniqueEntityID("question-1");

describe("Fetch Questions Comments", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch question comments", async () => {
    const student = makeStudent();

    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeQuestionComment({
      createdAt: new Date(2023, 0, 20),
      questionId: QUESTION1_ID,
      authorId: student.id,
    });
    const comment2 = makeQuestionComment({
      createdAt: new Date(2023, 0, 18),
      questionId: QUESTION1_ID,
      authorId: student.id,
    });
    const comment3 = makeQuestionComment({
      createdAt: new Date(2023, 0, 23),
      questionId: QUESTION1_ID,
      authorId: student.id,
    });

    await inMemoryQuestionCommentsRepository.create(comment1);

    await inMemoryQuestionCommentsRepository.create(comment2);

    await inMemoryQuestionCommentsRepository.create(comment3);

    const result = await sut.execute({
      questionId: QUESTION1_ID.toString(),
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual([
      expect.objectContaining({
        createdAt: new Date(2023, 0, 23),
        commentId: comment3.id,
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 20),
        commentId: comment1.id,
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 18),
        commentId: comment2.id,
      }),
    ]);
  });

  it("should be able to fetch paginate que comments", async () => {
    const student = makeStudent();

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          createdAt: new Date(2023, 0, i),
          questionId: QUESTION1_ID,
          authorId: student.id,
        })
      );
    }
    const result = await sut.execute({
      questionId: QUESTION1_ID.toString(),
      page: 1,
    });

    expect(result.value?.comments.length).toEqual(20);
  });

  it("should be able to fetch paginate que comments with limit", async () => {
    const student = makeStudent();

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i < 10; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          createdAt: new Date(2023, 0, i),
          questionId: QUESTION1_ID,
          authorId: student.id,
        })
      );
    }
    const result = await sut.execute({
      questionId: QUESTION1_ID.toString(),
      page: 1,
      limitPerPage: 5,
    });

    expect(result.value?.comments.length).toEqual(5);
  });
});
