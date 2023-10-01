import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateStudentUseCase } from "../authenticate-student";
import { makeStudent } from "test/factories/make-student";
import { WrongCredentialsError } from "../errors/wrong-credentials-error";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate student", async () => {
    const student = makeStudent();
    const plainPassword = student.password;
    student.password = await fakeHasher.hash(student.password);

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
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able hash password", async () => {
    const student = makeStudent();
    student.password = await fakeHasher.hash(student.password);

    inMemoryStudentsRepository.items.push(student);

    const result = await sut.execute({
      email: student.email,
      password: "anotherPassword",
    });

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
