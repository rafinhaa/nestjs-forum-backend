import { BadRequestException, HttpStatus, PipeTransform } from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";

export class ZodValidatePipe implements PipeTransform {
  private value: unknown;

  constructor(private schema: ZodSchema) {}

  getValue() {
    return this.value;
  }

  setValue(value: unknown) {
    this.value = value;
  }

  transform(value: unknown) {
    try {
      this.setValue(this.schema.parse(value));
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          error: error.flatten().fieldErrors,
          message: "Verification failed",
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      throw new BadRequestException();
    }
    return this.getValue();
  }
}
