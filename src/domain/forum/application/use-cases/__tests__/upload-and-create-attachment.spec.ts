import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { UploadAndCreateAttachmentUseCase } from "../upload-and-create-attachment";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidAttachmentTypeError } from "../errors/invalid-attachment-type";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakerUploader: FakeUploader;

let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakerUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakerUploader
    );
  });

  it("should be able to upload and create an attachment", async () => {
    const result = await sut.execute({
      fileName: "jane.doe.profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(fakerUploader.uploads).toHaveLength(1);
    expect(fakerUploader.uploads[0]).toEqual({
      filename: "jane.doe.profile.png",
      url: expect.any(String),
    });
  });

  it("should not be able an attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "jane.doe.profile.mp3",
      fileType: "audio/mp3",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
