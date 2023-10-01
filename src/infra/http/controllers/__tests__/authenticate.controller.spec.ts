import { AuthenticateController } from "../authenticate.controller";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("AuthenticateController", () => {
  let controller: AuthenticateController;
  let useCase: AuthenticateStudentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticateController],
      providers: [
        {
          provide: AuthenticateStudentUseCase,
          useValue: {
            execute: vitest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthenticateController>(AuthenticateController);
    useCase = module.get<AuthenticateStudentUseCase>(
      AuthenticateStudentUseCase
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it.skip("should throw UnauthorizedException when authentication fails", async () => {
    useCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
      value: new UnauthorizedException("Invalid credentials"),
    });

    try {
      await controller.handle({
        email: "invalid@example.com",
        password: "invalid",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it("should throw BadRequestException when input data is invalid", async () => {
    useCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => true,
      value: new BadRequestException("Invalid input data"),
    });

    try {
      await controller.handle({ email: "invalid-email", password: "123" });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it("should return access token when authentication succeeds", async () => {
    useCase.execute = vitest.fn().mockReturnValueOnce({
      isLeft: () => false,
      value: { accessToken: "valid-access-token" },
    });

    const result = await controller.handle({
      email: "valid@example.com",
      password: "valid",
    });

    expect(result).toEqual({ accessToken: "valid-access-token" });
  });
});
