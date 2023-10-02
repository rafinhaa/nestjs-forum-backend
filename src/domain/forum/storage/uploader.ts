export interface UploadParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export abstract class Uploader {
  abstract upload(file: UploadParams): Promise<{ url: string }>;
}
