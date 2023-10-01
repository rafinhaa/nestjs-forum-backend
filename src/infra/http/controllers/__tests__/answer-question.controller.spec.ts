import { AnswerQuestionController } from "../answer-question.controller";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("AnswerQuestionController", () => {
  let controller: AnswerQuestionController;
  let answerQuestionUseCase: AnswerQuestionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerQuestionController],
      providers: [
        {
          provide: AnswerQuestionUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnswerQuestionController>(AnswerQuestionController);
    answerQuestionUseCase = module.get<AnswerQuestionUseCase>(
      AnswerQuestionUseCase
    );
  });

  it("should throw BadRequestException when AnswerQuestionUseCase returns an error", async () => {
    answerQuestionUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () =>
        await controller.handle(
          {
            content: "Invalid Content",
          },
          { sub: "user-id" },
          "question-id"
        )
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
