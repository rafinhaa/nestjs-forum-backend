import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/attachments")
@UseInterceptors(FileInterceptor("file"))
export class UploadAttachmentController {
  @Post()
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: ".(png|jpg|jpeg|pdf)" }),
        ],
      })
    )
    file: Express.Multer.File
  ) {}
}
