import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
  constructor(private getQuestionsBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param("slug") slug: string) {
    const questions = await this.getQuestionsBySlug.execute({
      slug,
    });

    if (questions.isLeft()) {
      throw new BadRequestException();
    }

    const result = questions.value;

    return {
      question: QuestionPresenter.toHTTP(result.question),
    };
  }
}
