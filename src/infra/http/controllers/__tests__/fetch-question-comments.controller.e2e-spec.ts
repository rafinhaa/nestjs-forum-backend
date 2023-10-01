import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch question comment (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;
  let questionCommentFactory: QuestionCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);

    await app.init();
  });

  test("[GET] /question/:questionId/comments", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const [question] = await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user.id,
      }),
    ]);

    const [questionComment1, questionComment2] = await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
      }),
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/question/${question.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.comments.length).toEqual(2);
    expect(response.body).toEqual({
      pages: 1,
      comments: expect.arrayContaining([
        {
          id: questionComment2.id.toString(),
          content: questionComment2.content,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: questionComment1.id.toString(),
          content: questionComment1.content,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    });
  });
});
