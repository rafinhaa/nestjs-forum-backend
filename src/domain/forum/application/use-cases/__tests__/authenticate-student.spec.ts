import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakerHasher } from "test/cryptography/faker-hasher";
import { StudentAlreadyExistsError } from "../errors/student-already-exists-error";
import { FakerEncrypter } from "test/cryptography/faker-encrypter";
import { AuthenticateStudentUseCase } from "../authenticate-student";
import { makeStudent } from "test/factories/make-student";
import { WrongCredentialError } from "../errors/wrong-credential-error";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakerHasher: FakerHasher;
let fakeEncrypter: FakerEncrypter;

let sut: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakerHasher = new FakerHasher();
    fakeEncrypter = new FakerEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakerHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate student", async () => {
    const student = makeStudent();
    const plainPassword = student.password;
    student.password = await fakerHasher.hash(student.password);

    inMemoryStudentsRepository.items.push(student);

    const result = await sut.execute({
      email: student.email,
      password: plainPassword,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should not be able to not found student", async () => {
    const student = makeStudent();

    const result = await sut.execute({
      email: student.email,
      password: student.password,
    });

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(WrongCredentialError);
  });

  it("should not be able hash password", async () => {
    const student = makeStudent();
    student.password = await fakerHasher.hash(student.password);

    inMemoryStudentsRepository.items.push(student);

    const result = await sut.execute({
      email: student.email,
      password: "anotherPassword",
    });

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(WrongCredentialError);
  });
});
