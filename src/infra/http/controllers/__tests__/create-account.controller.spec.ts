import { CreateAccountController } from "../create-account.controller";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("CreateAccountController", () => {
  let controller: CreateAccountController;
  let useCase: RegisterStudentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateAccountController],
      providers: [
        {
          provide: RegisterStudentUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateAccountController>(CreateAccountController);
    useCase = module.get<RegisterStudentUseCase>(RegisterStudentUseCase);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it.skip("should throw ConflictException when student already exists", async () => {
    useCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
      value: new ConflictException("Student already exists"),
    });

    try {
      await controller.handle({
        name: "John Doe",
        email: "existing-email@example.com",
        password: "password",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
    }
  });

  it("should throw BadRequestException when input data is invalid", async () => {
    useCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
      value: new BadRequestException("Invalid input data"),
    });

    try {
      await controller.handle({
        name: "John Doe",
        email: "invalid-email",
        password: "123",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it("should return status 201 when registration succeeds", async () => {
    useCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => false,
    });

    const response = await controller.handle({
      name: "John Doe",
      email: "new-email@example.com",
      password: "password",
    });

    expect(response).toEqual(undefined);
  });
});
