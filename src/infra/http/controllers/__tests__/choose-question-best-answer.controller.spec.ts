import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ChooseQuestionBestAnswerController } from "../choose-question-best-answer.controller";

describe("ChooseQuestionBestAnswerController", () => {
  let controller: ChooseQuestionBestAnswerController;
  let useCase: RegisterStudentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChooseQuestionBestAnswerController],
      providers: [
        {
          provide: RegisterStudentUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChooseQuestionBestAnswerController>(
      ChooseQuestionBestAnswerController
    );
    useCase = module.get<RegisterStudentUseCase>(RegisterStudentUseCase);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should throw BadRequestException when input data is invalid", async () => {
    useCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
      value: new BadRequestException("Invalid input data"),
    });

    expect(
      async () => await controller.handle({ sub: "user-id" }, "answer-id")
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should return status 204 when choosing succeeds", async () => {
    useCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => false,
    });

    const response = await controller.handle({ sub: "user-id" }, "answer-id");

    expect(response).toEqual(undefined);
  });
});
