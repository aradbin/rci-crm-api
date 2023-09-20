import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UnprocessableEntityException,
  Query,
  HttpStatus,
  ParseIntPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Response } from "express";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.usersService.findAll(query);
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @Res() response: Response,
  ) {
    const data = await this.usersService.findOne(id);

    if(data){
      return response.status(HttpStatus.OK).send(data)
    }
    return response.status(HttpStatus.NOT_FOUND).send({
      message: 'No User Found'
    })
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.update(id, updateUserDto);
      await this.usersService.update(id, updateUserDto);
      return {
        message: "User Updated Successfully",
        data: id,
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
