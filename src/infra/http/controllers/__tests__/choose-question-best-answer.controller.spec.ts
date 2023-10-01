import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ChooseQuestionBestAnswerController } from "../choose-question-best-answer.controller";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";

describe("ChooseQuestionBestAnswerController", () => {
  let controller: ChooseQuestionBestAnswerController;
  let chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChooseQuestionBestAnswerController],
      providers: [
        {
          provide: ChooseQuestionBestAnswerUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChooseQuestionBestAnswerController>(
      ChooseQuestionBestAnswerController
    );
    chooseQuestionBestAnswerUseCase =
      module.get<ChooseQuestionBestAnswerUseCase>(
        ChooseQuestionBestAnswerUseCase
      );
  });

  it("should throw BadRequestException when ChooseQuestionBestAnswerUseCase returns an error", async () => {
    chooseQuestionBestAnswerUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () => await controller.handle({ sub: "user-id" }, "question-id")
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
