import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DeleteAnswerCommentController } from "../delete-answer-comment.controller";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";

describe("DeleteAnswerCommentController", () => {
  let controller: DeleteAnswerCommentController;
  let deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteAnswerCommentController],
      providers: [
        {
          provide: DeleteAnswerCommentUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeleteAnswerCommentController>(
      DeleteAnswerCommentController
    );
    deleteAnswerCommentUseCase = module.get<DeleteAnswerCommentUseCase>(
      DeleteAnswerCommentUseCase
    );
  });

  it("should throw BadRequestException when DeleteAnswerCommentUseCase returns an error", async () => {
    deleteAnswerCommentUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () => await controller.handle({ sub: "user-id" }, "answer-id")
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
