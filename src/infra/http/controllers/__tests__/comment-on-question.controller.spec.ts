import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CommentOnQuestionController } from "../comment-on-question.controller";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";

describe("CommentOnQuestionController", () => {
  let controller: CommentOnQuestionController;
  let commentOnQuestionUseCase: CommentOnQuestionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentOnQuestionController],
      providers: [
        {
          provide: CommentOnQuestionUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentOnQuestionController>(
      CommentOnQuestionController
    );
    commentOnQuestionUseCase = module.get<CommentOnQuestionUseCase>(
      CommentOnQuestionUseCase
    );
  });

  it("should throw BadRequestException when CommentOnQuestionUseCase returns an error", async () => {
    commentOnQuestionUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () =>
        await controller.handle(
          {
            content: "content",
          },
          { sub: "user-id" },
          "question-id"
        )
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
