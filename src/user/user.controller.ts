import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Public } from 'src/auth/public.decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(@Body() createUserDto: CreateUserDto, @UploadedFile() avatar: Express.Multer.File) {
    return this.userService.create(createUserDto, avatar);
  }

  @Get()
  async findAll(@Query() query) {
    return await this.userService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const data = await this.userService.findOne(id);

    if (data) {
      return response.status(HttpStatus.OK).send(data);
    }
    return response.status(HttpStatus.NOT_FOUND).send({
      message: 'No User Found',
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @UploadedFile() avatar: Express.Multer.File) {
    try {
      return await this.userService.update(id, updateUserDto, avatar);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.userService.remove(id);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
