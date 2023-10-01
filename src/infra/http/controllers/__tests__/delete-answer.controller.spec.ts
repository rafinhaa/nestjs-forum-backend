import { DeleteAnswerController } from "../delete-answer.controller";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("DeleteAnswerController", () => {
  let controller: DeleteAnswerController;
  let deleteAnswerUseCase: DeleteAnswerUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteAnswerController],
      providers: [
        {
          provide: DeleteAnswerUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeleteAnswerController>(DeleteAnswerController);
    deleteAnswerUseCase = module.get<DeleteAnswerUseCase>(DeleteAnswerUseCase);
  });

  it("should throw BadRequestException when DeleteAnswerUseCase returns an error", async () => {
    deleteAnswerUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () => await controller.handle({ sub: "user-id" }, "answer-id")
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
