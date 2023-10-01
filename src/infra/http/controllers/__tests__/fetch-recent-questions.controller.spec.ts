import { FetchRecentQuestionsController } from "../fetch-recent-questions.controller";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("FetchRecentQuestionsController", () => {
  let controller: FetchRecentQuestionsController;
  let fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchRecentQuestionsController],
      providers: [
        {
          provide: FetchRecentQuestionsUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FetchRecentQuestionsController>(
      FetchRecentQuestionsController
    );
    fetchRecentQuestionsUseCase = module.get<FetchRecentQuestionsUseCase>(
      FetchRecentQuestionsUseCase
    );
  });

  it("should throw BadRequestException when FetchRecentQuestionsUseCase returns an error", async () => {
    fetchRecentQuestionsUseCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
    });

    expect(
      async () =>
        await controller.handle({
          page: 1,
          limit: 10,
        })
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
