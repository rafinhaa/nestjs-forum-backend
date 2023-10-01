import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Answer question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let jwt: JwtService;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);

    await app.init();
  });

  test("[POST] /questions/:questionId/answers", async () => {
    const user = await studentFactory.makePrismaStudent();
    const user2 = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });
    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user2.id,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id}/answers`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: answer.content,
      });

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.answer.findFirst({
      where: {
        id: answer.id.toString(),
      },
    });

    expect(questionOnDatabase).toBeTruthy();
    expect(questionOnDatabase).toEqual({
      id: answer.id.toString(),
      content: answer.content,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
    });
  });
});
