import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudentFactory } from "test/factories/make-student";

describe("Comment on answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let jwt: JwtService;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;
  let answerFactory: AnswerFactory;
  let answerCommentFactory: AnswerCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        QuestionCommentFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory);

    await app.init();
  });

  test("[POST] /answers/:answerId/comments", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const user2 = await studentFactory.makePrismaStudent();
    const answer = await answerFactory.makePrismaAnswer({
      authorId: user2.id,
      questionId: question.id,
    });

    const user3 = await studentFactory.makePrismaStudent();
    const comment = await answerCommentFactory.makePrismaAnswerComment({
      answerId: answer.id,
      authorId: user3.id,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post(`/answers/${answer.id}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: comment.content,
      });

    expect(response.statusCode).toBe(201);

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        id: comment.id.toString(),
      },
    });

    expect(commentOnDatabase).toBeTruthy();
    expect(commentOnDatabase).toEqual({
      questionId: null,
      authorId: user3.id.toString(),
      content: comment.content,
      createdAt: expect.any(Date),
      id: comment.id.toString(),
      answerId: comment.answerId.toString(),
      updatedAt: expect.any(Date),
    });
  });
});
