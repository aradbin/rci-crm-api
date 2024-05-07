import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() createContactDto: CreateContactDto, @UploadedFile() avatar: Express.Multer.File) {
    return this.contactService.create(createContactDto, avatar);
  }

  @Get()
  findAll(@Query() query) {
    return this.contactService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.contactService.update(+id, updateContactDto, avatar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
