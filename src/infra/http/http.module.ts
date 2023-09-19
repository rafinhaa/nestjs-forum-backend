import { Module } from "@nestjs/common";
import { AuthenticateController } from "@/infra/http/controllers/authenticate.controller";
import { CreateQuestionController } from "@/infra/http/controllers/create-question.controller";
import { FetchRecentQuestionsController } from "@/infra/http/controllers/fetch-recent-questions.controller";
import { CreateAccountController } from "@/infra/http/controllers/create-account.controller";
import { PrismaService } from "@/infra/prisma/prisma.service";

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
