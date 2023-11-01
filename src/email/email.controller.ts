import {
  Controller,
  Get,
  Post,
  Body,
  UnprocessableEntityException,
  Request,
} from "@nestjs/common";
import { EmailService } from "./email.service";
import { CreateEmailDto } from "./dto/create-email.dto";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post()
  async create(@Request() req: any, @Body() createEmailDto: CreateEmailDto) {
    try {
      return await this.emailService.create(req?.user?.id, createEmailDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get()
  async find() {
    return await this.emailService.find();
  }
}
