import { Question } from "@/domain/forum/enterprise/entities/question";
import { Student } from "../../enterprise/entities/student";

export interface IStudentsRepository {
  findByEmail(email: string): Promise<Student | null>;
  create(student: Student): Promise<void>;
}

export abstract class StudentsRepository implements IStudentsRepository {
  abstract findByEmail(email: string): Promise<Student | null>;
  abstract create(student: Student): Promise<void>;
}
