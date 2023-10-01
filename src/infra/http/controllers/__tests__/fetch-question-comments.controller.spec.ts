import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { FetchQuestionCommentsController } from "../fetch-question-comments.controller";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";

describe("FetchQuestionCommentController", () => {
  let controller: FetchQuestionCommentsController;
  let fetchQuestionCommentUseCase: FetchQuestionCommentsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchQuestionCommentsController],
      providers: [
        {
          provide: FetchQuestionCommentsUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FetchQuestionCommentsController>(
      FetchQuestionCommentsController
    );
    fetchQuestionCommentUseCase = module.get<FetchQuestionCommentsUseCase>(
      FetchQuestionCommentsUseCase
    );
  });

  it("should throw BadRequestException when FetchQuestionCommentsUseCase returns an error", async () => {
    fetchQuestionCommentUseCase.execute = vitest.fn().mockReturnValueOnce({
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
