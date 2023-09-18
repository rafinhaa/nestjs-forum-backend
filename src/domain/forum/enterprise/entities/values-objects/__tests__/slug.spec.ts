import { Slug } from "../slug";

it("should be able to create a new slug from text", async () => {
  const slug = Slug.createFromText("New response to the question");

  expect(slug.value).toBe("new-response-to-the-question");
});

it("should be able to create a new slug", async () => {
  const slug = Slug.create("New response to the question");

  expect(slug.value).toBe("new-response-to-the-question");
});