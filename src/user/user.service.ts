import { Inject, Injectable, NotAcceptableException } from "@nestjs/common";
import { ModelClass } from "objection";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserModel } from "./user.model";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(@Inject("UserModel") private modelClass: ModelClass<UserModel>) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.modelClass.query().where("email", createUserDto.email).first();
    if (user) {
      throw new NotAcceptableException("Email already exists");
    }
    const hash = bcrypt.hashSync(createUserDto.password, 10);

    return await this.modelClass
      .query()
      .insert({ ...createUserDto, password: hash });
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().paginate(params).filter(params).withGraphFetched('userSettings.settings').find()
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).withGraphFetched('userSettings.settings').first().find();
  }

  async findByEmail(email: string) {
    return await this.modelClass.query().where("email", email).withGraphFetched('userSettings.settings').withGraphFetched('emailSettings').first().find();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hasUser = await this.modelClass.query().where("id", "!=", id).where("email", updateUserDto.email).first().find();
    if (hasUser) {
      throw new NotAcceptableException("Email already exists");
    }
    return await this.modelClass.query().findById(id).update(updateUserDto);
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id);
  }
}
