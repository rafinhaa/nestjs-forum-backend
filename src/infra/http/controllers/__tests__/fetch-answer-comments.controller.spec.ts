import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { FetchAnswerCommentsController } from "../fetch-answer-comments.controller";

describe("FetchAnswerCommentsController", () => {
  let controller: FetchAnswerCommentsController;
  let fetchAnswerCommentUseCase: FetchAnswerCommentsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchAnswerCommentsController],
      providers: [
        {
          provide: FetchAnswerCommentsUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FetchAnswerCommentsController>(
      FetchAnswerCommentsController
    );
    fetchAnswerCommentUseCase = module.get<FetchAnswerCommentsUseCase>(
      FetchAnswerCommentsUseCase
    );
  });

  it("should throw BadRequestException when FetchAnswerCommentsUseCase returns an error", async () => {
    fetchAnswerCommentUseCase.execute = vitest.fn().mockReturnValueOnce({
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
