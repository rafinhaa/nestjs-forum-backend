import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { StudentsRepository } from "../repositories/students-repository";
import { HashComparer } from "../criptography/hash-compare";
import { Encrypter } from "../criptography/encrypter";
import { WrongCredentialError } from "./errors/wrong-credential-error";

interface AuthenticateStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialError());
    }

    const hashedPassword = await this.hashCompare.compare(
      password,
      student.password
    );

    if (!hashedPassword) {
      return left(new WrongCredentialError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}
