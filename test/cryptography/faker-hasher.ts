import { HashComparer } from "@/domain/forum/application/criptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/criptography/hash-generator";

export class FakerHasher implements HashComparer, HashGenerator {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat("-hashed") === hash;
  }

  async hash(plain: string): Promise<string> {
    return plain.concat("-hashed");
  }
}
