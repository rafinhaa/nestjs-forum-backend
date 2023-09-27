import { faker } from "@faker-js/faker";

import { Student } from "@/domain/forum/enterprise/entities/student";

export const makeStudent = (override?: Partial<Student>): Student => {
  return Student.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  });
};
