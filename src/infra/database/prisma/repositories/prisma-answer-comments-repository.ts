import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!answerComment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    const answersComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: params.limitPerPage,
      skip: (params.page - 1) * params.limitPerPage,
    });

    return answersComments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    const questionsComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: params.limitPerPage,
      skip: (params.page - 1) * params.limitPerPage,
    });

    return questionsComments.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    });
  }

  async getPages({ limitPerPage }: PaginationParams): Promise<number> {
    return Math.ceil((await this.prisma.comment.count()) / limitPerPage);
  }
}
