import { Uploader } from "@/domain/forum/storage/uploader";
import { R2Storage } from "./r2-storage";
import { EnvService } from "../env/env.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [EnvService],
  providers: [{ provide: Uploader, useClass: R2Storage }],
  exports: [Uploader],
})
export class StorageModule {}
