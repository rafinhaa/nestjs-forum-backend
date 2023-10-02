import { Uploader, UploadParams } from "@/domain/forum/storage/uploader";
import { faker } from "@faker-js/faker";

interface Upload {
  filename: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload(params: UploadParams): Promise<{ url: string }> {
    const url = faker.internet.url();

    this.uploads.push({
      filename: params.fileName,
      url,
    });

    return { url };
  }
}
