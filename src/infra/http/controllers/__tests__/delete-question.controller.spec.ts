import { DeleteQuestionController } from "../delete-question.controller";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("DeleteQuestionController", () => {
  let controller: DeleteQuestionController;
  let deleteQuestionUseCase: DeleteQuestionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteQuestionController],
      providers: [
        {
          provide: DeleteQuestionUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeleteQuestionController>(DeleteQuestionController);
    deleteQuestionUseCase = module.get<DeleteQuestionUseCase>(
      DeleteQuestionUseCase
    );
  });

  it("should throw BadRequestException when DeleteQuestionUseCase returns an error", async () => {
    deleteQuestionUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () => await controller.handle({ sub: "user-id" }, "question-id")
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
