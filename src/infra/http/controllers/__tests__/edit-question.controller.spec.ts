import { EditQuestionController } from "../edit-question.controller";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("EditQuestionController", () => {
  let controller: EditQuestionController;
  let editQuestionUseCase: EditQuestionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditQuestionController],
      providers: [
        {
          provide: EditQuestionUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EditQuestionController>(EditQuestionController);
    editQuestionUseCase = module.get<EditQuestionUseCase>(EditQuestionUseCase);
  });

  it("should throw BadRequestException when EditQuestionUseCase returns an error", async () => {
    editQuestionUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () =>
        await controller.handle(
          {
            title: "Invalid Title",
            content: "Invalid Content",
          },
          { sub: "user-id" },
          "question-id"
        )
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
