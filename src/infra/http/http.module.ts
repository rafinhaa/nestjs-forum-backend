import { Module } from "@nestjs/common";
import { AuthenticateController } from "@/infra/http/controllers/authenticate.controller";
import { CreateQuestionController } from "@/infra/http/controllers/create-question.controller";
import { FetchRecentQuestionsController } from "@/infra/http/controllers/fetch-recent-questions.controller";
import { CreateAccountController } from "@/infra/http/controllers/create-account.controller";
import { DatabaseModule } from "@/infra/database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [CreateQuestionUseCase],
})
export class HttpModule {}
