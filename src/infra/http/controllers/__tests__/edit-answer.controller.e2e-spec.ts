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

describe("Edit answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PUT] /answers/:id", async () => {
    const user = await studentFactory.makePrismaStudent();
    const user2 = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });
    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user2.id,
    });

    const accessToken = jwt.sign({ sub: user2.id.toString() });

    const response = await request(app.getHttpServer())
      .put(`/answers/${answer.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "New answer content",
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        id: answer.id.toString(),
      },
    });

    expect(answerOnDatabase).toBeTruthy();
    expect(answerOnDatabase).toEqual({
      id: answer.id.toString(),
      content: "New answer content",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
    });
  });
});
