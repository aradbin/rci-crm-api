import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Res,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Response } from 'express';
import { CreateEmailDto } from "./dto/create-email.dto";
import { EmailService } from "./email.service";

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
  async findAll(@Query() query: any) {
    return await this.emailService.findAll(query);
  }

  @Get('sync')
  async sync(@Request() req: any, @Query() query: any) {
    return await this.emailService.sync(req?.user?.id, query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const data = await this.emailService.findOne(id);
    if(data){
      return response.status(HttpStatus.OK).send(data)
    }
    return response.status(HttpStatus.NOT_FOUND).send({
      message: 'No Email Found'
    })
  }
}
