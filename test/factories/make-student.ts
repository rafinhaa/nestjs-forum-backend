import { faker } from "@faker-js/faker";

import { Student } from "@/domain/forum/enterprise/entities/student";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaStudentMapper } from "@/infra/database/prisma/mappers/prisma-student-mapper";

export const makeStudent = (
  override?: Partial<Student>,
  id?: UniqueEntityID
): Student => {
  return Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );
};

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data?: Partial<Student>): Promise<Student> {
    const student = makeStudent(data);

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    });

    return student;
  }
}
