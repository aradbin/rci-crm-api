import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { EmailSettingsModule } from "src/email-settings/email-settings.module";

@Module({
  imports: [EmailSettingsModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule { }
