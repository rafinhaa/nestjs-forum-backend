import { CreateQuestionController } from "../create-question.controller";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("CreateQuestionController", () => {
  let controller: CreateQuestionController;
  let createQuestionUseCase: CreateQuestionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateQuestionController],
      providers: [
        {
          provide: CreateQuestionUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateQuestionController>(CreateQuestionController);
    createQuestionUseCase = module.get<CreateQuestionUseCase>(
      CreateQuestionUseCase
    );
  });

  it("should throw BadRequestException when CreateQuestionUseCase returns an error", async () => {
    createQuestionUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () =>
        await controller.handle(
          {
            title: "Invalid Title",
            content: "Invalid Content",
          },
          { sub: "user-id" }
        )
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
