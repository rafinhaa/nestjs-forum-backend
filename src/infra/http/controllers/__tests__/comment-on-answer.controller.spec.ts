import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CommentOnAnswerController } from "../comment-on-answer.controller";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";

describe("CommentOnAnswerController", () => {
  let controller: CommentOnAnswerController;
  let commentOnAnswerUseCase: CommentOnAnswerUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentOnAnswerController],
      providers: [
        {
          provide: CommentOnAnswerUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentOnAnswerController>(
      CommentOnAnswerController
    );
    commentOnAnswerUseCase = module.get<CommentOnAnswerUseCase>(
      CommentOnAnswerUseCase
    );
  });

  it("should throw BadRequestException when CommentOnAnswerUseCase returns an error", async () => {
    commentOnAnswerUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () =>
        await controller.handle(
          {
            content: "content",
          },
          { sub: "user-id" },
          "answer-id"
        )
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
