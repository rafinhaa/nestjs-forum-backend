import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { GetQuestionBySlugController } from "../get-question-by-slug.controller";
import { makeQuestion } from "test/factories/make-question";
import { QuestionPresenter } from "../../presenters/question-presenter";

describe("GetQuestionBySlugController", () => {
  let controller: GetQuestionBySlugController;
  let useCase: GetQuestionBySlugUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetQuestionBySlugController],
      providers: [
        {
          provide: GetQuestionBySlugUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetQuestionBySlugController>(
      GetQuestionBySlugController
    );
    useCase = module.get<GetQuestionBySlugUseCase>(GetQuestionBySlugUseCase);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should throw BadRequestException when GetQuestionBySlugUseCase returns a left result", async () => {
    useCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () => await controller.handle("invalid-slug")
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should return a question when GetQuestionBySlugUseCase returns a right result", async () => {
    const question = makeQuestion();
    useCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => false,
      value: { question },
    });

    const result = await controller.handle("valid-slug");

    expect(result).toEqual({ question: QuestionPresenter.toHTTP(question) });
  });
});
