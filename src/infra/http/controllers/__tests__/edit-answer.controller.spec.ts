import { EditAnswerController } from "../edit-answer.controller";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("EditAnswerController", () => {
  let controller: EditAnswerController;
  let editAnswerUseCase: EditAnswerUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditAnswerController],
      providers: [
        {
          provide: EditAnswerUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EditAnswerController>(EditAnswerController);
    editAnswerUseCase = module.get<EditAnswerUseCase>(EditAnswerUseCase);
  });

  it("should throw BadRequestException when EditAnswerUseCase returns an error", async () => {
    editAnswerUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () =>
        await controller.handle(
          {
            content: "new content",
          },
          { sub: "user-id" },
          "answer-id"
        )
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
