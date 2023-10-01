import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { FetchAnswerCommentsUseCase } from "../fetch-answer-comments";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comment";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

const ANSWER1_ID = new UniqueEntityID("answer-1");

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        createdAt: new Date(2023, 0, 20),
        answerId: ANSWER1_ID,
      })
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        createdAt: new Date(2023, 0, 18),
        answerId: ANSWER1_ID,
      })
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        createdAt: new Date(2023, 0, 23),
        answerId: ANSWER1_ID,
      })
    );

    const result = await sut.execute({
      answerId: ANSWER1_ID.toString(),
      page: 1,
    });

    expect(result.value?.answerComments).toHaveLength(3);
    expect(result.value?.answerComments).toEqual([
      expect.objectContaining({
        createdAt: new Date(2023, 0, 23),
        answerId: ANSWER1_ID,
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 20),
        answerId: ANSWER1_ID,
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 18),
        answerId: ANSWER1_ID,
      }),
    ]);
  });

  it("should be able to fetch paginate answer comments", async () => {
    for (let i = 1; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          createdAt: new Date(2023, 0, i),
          answerId: ANSWER1_ID,
        })
      );
    }
    const result = await sut.execute({
      answerId: ANSWER1_ID.toString(),
      page: 1,
    });

    expect(result.value?.answerComments.length).toEqual(20);
  });

  it("should be able to fetch paginate answer comments with limit", async () => {
    for (let i = 1; i < 10; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          createdAt: new Date(2023, 0, i),
          answerId: ANSWER1_ID,
        })
      );
    }
    const result = await sut.execute({
      answerId: ANSWER1_ID.toString(),
      page: 1,
      limitPerPage: 5,
    });

    expect(result.value?.answerComments.length).toEqual(5);
  });
});
