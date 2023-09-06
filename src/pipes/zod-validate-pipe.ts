import { BadRequestException, HttpStatus, PipeTransform } from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";

export class ZodValidatePipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
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
    return value;
  }
}
