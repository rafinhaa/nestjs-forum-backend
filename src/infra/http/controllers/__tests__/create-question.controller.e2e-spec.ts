import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Create question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let jwt: JwtService;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);
    questionFactory = moduleRef.get(QuestionFactory);

    await app.init();
  });

  test("[POST] /questions", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: question.title,
        content: question.content,
      });

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: question.title,
      },
    });

    expect(questionOnDatabase).toBeTruthy();
    expect(questionOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        authorId: user.id.toString(),
        content: question.content,
        createdAt: expect.any(Date),
        slug: question.slug.value,
        title: question.title,
        updatedAt: expect.any(Date),
      })
    );
  });
});
