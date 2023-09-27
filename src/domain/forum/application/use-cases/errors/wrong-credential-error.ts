import { UseCaseError } from "@/core/errors/use-case-error";

export class WrongCredentialError extends Error implements UseCaseError {
  constructor() {
    super(`Credintials are not valid.`);
  }
}
