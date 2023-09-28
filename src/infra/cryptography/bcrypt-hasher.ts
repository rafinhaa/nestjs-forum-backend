import { HashComparer } from "@/domain/forum/application/criptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/criptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
  async hash(plain: string): Promise<string> {
    return hash(plain, 10);
  }
}
