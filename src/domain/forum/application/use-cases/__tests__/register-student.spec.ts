import { RegisterStudentUseCase } from "../register-student";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakerHasher } from "test/cryptography/faker-hasher";
import { StudentAlreadyExistsError } from "../errors/student-already-exists-error";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakerHasher: FakerHasher;

let sut: RegisterStudentUseCase;

describe("Register Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakerHasher = new FakerHasher();
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakerHasher);
  });

  it("should be able to register a new student", async () => {
    const result = await sut.execute({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  it("should hash the password upon registration", async () => {
    const result = await sut.execute({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password",
    });

    const hashedPassword = await fakerHasher.hash("password");

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      hashedPassword
    );
  });

  it("should not be able to register a student with the same email", async () => {
    await sut.execute({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password",
    });

    const result = await sut.execute({
      name: "Jane Doe 2",
      email: "jane.doe@example.com",
      password: "password",
    });

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
  });
});
