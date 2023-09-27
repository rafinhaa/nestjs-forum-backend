import { Encrypter } from "@/domain/forum/application/criptography/encrypter";

export class FakerEncrypter implements Encrypter {
  encrypt(payload: Record<string, unknown>): Promise<string> {
    return Promise.resolve("encrypted");
  }
}
