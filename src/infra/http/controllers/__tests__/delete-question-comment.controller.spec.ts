import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DeleteQuestionCommentController } from "../delete-question-comment.controller";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";

describe("DeleteQuestionCommentController", () => {
  let controller: DeleteQuestionCommentController;
  let deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteQuestionCommentController],
      providers: [
        {
          provide: DeleteQuestionCommentUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeleteQuestionCommentController>(
      DeleteQuestionCommentController
    );
    deleteQuestionCommentUseCase = module.get<DeleteQuestionCommentUseCase>(
      DeleteQuestionCommentUseCase
    );
  });

  it("should throw BadRequestException when DeleteQuestionCommentUseCase returns an error", async () => {
    deleteQuestionCommentUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () => await controller.handle({ sub: "user-id" }, "question-id")
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
