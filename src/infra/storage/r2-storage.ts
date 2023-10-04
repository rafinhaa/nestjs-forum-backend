import { UploadParams, Uploader } from "@/domain/forum/storage/uploader";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class R2Storage implements Uploader {
  private uploader: S3Client;

  constructor(private envService: EnvService) {
    const accessKeyId = this.envService.get("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.envService.get("AWS_SECRET_ACCESS_KEY");

    this.uploader = new S3Client({
      endpoint: "https://s3.tebi.io",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: "global",
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueName = `${uploadId}-${fileName}`;

    await this.uploader.send(
      new PutObjectCommand({
        Bucket: this.envService.get("AWS_BUCKET_NAME"),
        Key: uniqueName,
        ContentType: fileType,
        Body: body,
      })
    );

    return {
      url: uniqueName,
    };
  }
}
