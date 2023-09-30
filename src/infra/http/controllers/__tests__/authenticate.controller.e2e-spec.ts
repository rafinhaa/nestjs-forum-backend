import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

describe("AuthenticateController e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test("[POST] /sessions", async () => {
    const password = "123456";
    const student = await studentFactory.makePrismaStudent({
      password: await hash(password, 10),
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: student.email,
      password,
    });

    expect(response.status).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      })
    );
  });
});
