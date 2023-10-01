import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "../fetch-question-comments";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestionComment } from "test/factories/make-question-comment";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

const QUESTION1_ID = new UniqueEntityID("question-1");

describe("Fetch Questions Comments", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch question comments", async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        createdAt: new Date(2023, 0, 20),
        questionId: QUESTION1_ID,
      })
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        createdAt: new Date(2023, 0, 18),
        questionId: QUESTION1_ID,
      })
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        createdAt: new Date(2023, 0, 23),
        questionId: QUESTION1_ID,
      })
    );

    const result = await sut.execute({
      questionId: QUESTION1_ID.toString(),
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(3);
    expect(result.value?.questionComments).toEqual([
      expect.objectContaining({
        createdAt: new Date(2023, 0, 23),
        questionId: QUESTION1_ID,
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 20),
        questionId: QUESTION1_ID,
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 18),
        questionId: QUESTION1_ID,
      }),
    ]);
  });

  it("should be able to fetch paginate que comments", async () => {
    for (let i = 1; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          createdAt: new Date(2023, 0, i),
          questionId: QUESTION1_ID,
        })
      );
    }
    const result = await sut.execute({
      questionId: QUESTION1_ID.toString(),
      page: 1,
    });

    expect(result.value?.questionComments.length).toEqual(20);
  });

  it("should be able to fetch paginate que comments with limit", async () => {
    for (let i = 1; i < 10; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          createdAt: new Date(2023, 0, i),
          questionId: QUESTION1_ID,
        })
      );
    }
    const result = await sut.execute({
      questionId: QUESTION1_ID.toString(),
      page: 1,
      limitPerPage: 5,
    });

    expect(result.value?.questionComments.length).toEqual(5);
  });
});
