import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }
  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: params.limitPerPage,
      skip: (params.page - 1) * params.limitPerPage,
    });

    if (!answers) {
      return [];
    }

    return answers.map(PrismaAnswerMapper.toDomain);
  }
  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);
    await this.prisma.answer.create({
      data,
    });
  }
  async delete(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);
    await this.prisma.answer.delete({
      where: {
        id: data.id,
      },
    });
  }
  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);
    await this.prisma.answer.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
