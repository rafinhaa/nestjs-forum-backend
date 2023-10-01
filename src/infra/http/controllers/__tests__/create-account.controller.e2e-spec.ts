import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create Account (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /accounts", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "johndoe@example.com",
      },
    });

    expect(userOnDatabase).toBeTruthy();

    expect(userOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John Doe",
        email: "johndoe@example.com",
        password: expect.any(String),
      })
    );
  });

  test("[POST] /accounts already exists", async () => {
    const studentEmail = "johndoe@example.com";

    await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe",
      email: studentEmail,
      password: "123456",
    });

    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe 2",
      email: studentEmail,
      password: "123456",
    });

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      error: "Conflict",
      message: `Student \"${studentEmail}\" already exists.`,
      statusCode: 409,
    });
  });
});
