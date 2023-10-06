import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory, makeQuestion } from "test/factories/make-question";
import { QuestionAttachmentsFactory } from "test/factories/make-question-attachments";
import { StudentFactory } from "test/factories/make-student";

describe("Edit question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let jwt: JwtService;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentsFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentsFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentsFactory);

    await app.init();
  });

  test("[Put] /questions/:id", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const updatedQuestion = makeQuestion();

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachments({
      questionId: question.id,
      attachmentId: attachment1.id,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachments({
      questionId: question.id,
      attachmentId: attachment2.id,
    });

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: updatedQuestion.title,
        content: updatedQuestion.content,
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    expect(response.statusCode).toBe(204);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        id: question.id.toString(),
      },
    });

    expect(questionOnDatabase).toBeTruthy();
    expect(questionOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        authorId: user.id.toString(),
        content: updatedQuestion.content,
        createdAt: expect.any(Date),
        // slug: question.slug.value,
        title: updatedQuestion.title,
        updatedAt: expect.any(Date),
        bestAnswerId: null,
      })
    );
    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: question.id.toString(),
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ])
    );
  });
});
