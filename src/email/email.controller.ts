import {
  Controller,
  Get,
  Post,
  Body,
  UnprocessableEntityException,
  Request,
  Query,
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
  async findAll(@Request() req: any, @Query() query: any) {
    return await this.emailService.findAll(req?.user?.id, query);
  }
}
