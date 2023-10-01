import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { FetchQuestionAnswersController } from "../fetch-question-answers.controller";

describe("FetchQuestionAnswersController", () => {
  let controller: FetchQuestionAnswersController;
  let fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchQuestionAnswersController],
      providers: [
        {
          provide: FetchQuestionAnswersUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FetchQuestionAnswersController>(
      FetchQuestionAnswersController
    );
    fetchQuestionAnswersUseCase = module.get<FetchQuestionAnswersUseCase>(
      FetchQuestionAnswersUseCase
    );
  });

  it("should throw BadRequestException when FetchQuestionAnswersUseCase returns an error", async () => {
    fetchQuestionAnswersUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () =>
        await controller.handle(
          {
            page: 1,
            limit: 10,
          },
          "questionId"
        )
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
