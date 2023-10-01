import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

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

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });
  });

  test("[POST] /sessions unauthorized", async () => {
    const password = "123456";
    const student = await studentFactory.makePrismaStudent({
      password: await hash(password, 10),
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: student.email,
      password: "wrong-password",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      error: "Unauthorized",
      message: "Credentials are not valid.",
      statusCode: 401,
    });
  });
});
