import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }
  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: params.limitPerPage,
      skip: (params.page - 1) * params.limitPerPage,
    });

    if (!questions) {
      return [];
    }

    return questions.map(PrismaQuestionMapper.toDomain);
  }
  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.create({
      data,
    });
  }
  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    });
  }

  async getPages({ limitPerPage }: PaginationParams): Promise<number> {
    return Math.ceil((await this.prisma.question.count()) / limitPerPage);
  }
}
