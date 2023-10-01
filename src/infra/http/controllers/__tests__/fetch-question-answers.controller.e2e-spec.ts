import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { create } from "domain";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { object } from "zod";

describe("Fetch question answers (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;
  let answerFactory: AnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);
    answerFactory = moduleRef.get(AnswerFactory);

    await app.init();
  });

  test("[GET] /question/:questionId/answers", async () => {
    const user = await studentFactory.makePrismaStudent();
    const user2 = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const [question] = await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user2.id,
      }),
    ]);

    const [answer1, answer2] = await Promise.all([
      answerFactory.makePrismaAnswer({
        authorId: user2.id,
        questionId: question.id,
      }),
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/question/${question.id}/answers`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.answers.length).toEqual(2);
    expect(response.body).toEqual({
      pages: 1,
      answers: expect.arrayContaining([
        {
          id: answer2.id.toString(),
          content: answer2.content,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: answer1.id.toString(),
          content: answer1.content,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    });
  });
});
