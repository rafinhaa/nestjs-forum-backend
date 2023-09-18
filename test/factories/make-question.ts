import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/values-objects/slug";

export const makeQuestion = (
  override?: Partial<Question>,
  id?: UniqueEntityID
): Question => {
  const title = faker.lorem.sentence();
  const slug = Slug.createFromText(title);

  return Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      slug: slug,
      ...override,
    },
    id
  );
};
