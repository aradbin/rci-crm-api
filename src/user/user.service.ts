import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CreateUserDto, SendMessageDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel, UserMessageModel } from './user.model';
import * as bcrypt from 'bcrypt';
import { EventsGateway } from 'src/event-gateway/events.gateway';
import { UserSettingsService } from 'src/user-settings/user-settings.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(EventsGateway) private eventsGateway: EventsGateway,
    @Inject('UserModel') private modelClass: ModelClass<UserModel>,
    @Inject('UserMessageModel') private messageModelClass: ModelClass<UserMessageModel>,
    private userSettingsService: UserSettingsService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const hasUser = await this.modelClass.query().where('email', createUserDto.email).first();
    if (hasUser) {
      throw new NotAcceptableException('Email already exists');
    }

    const hash = bcrypt.hashSync(createUserDto.password, 10);
    const settings_id = createUserDto.settings_id
    delete createUserDto.settings_id

    const user = await this.modelClass.query().insert({ ...createUserDto, password: hash })

    if (user?.id && settings_id?.length > 0) {
      const userSettings = []
      settings_id?.map((item) => {
        userSettings.push({
          user_id: user.id,
          settings_id: item
        })
      })
      this.userSettingsService.create(userSettings)
    }

    return user;
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().paginate(params).filter(params).withGraphFetched('userSettings.settings').find();
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).withGraphFetched('userSettings.settings').first().find();
  }

  async findByEmail(email: string) {
    return await this.modelClass.query().where('email', email).withGraphFetched('userSettings.settings').withGraphFetched('runningTask').first().find();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hasUser = await this.modelClass.query().where('id', '!=', id).where('email', updateUserDto.email).first().find();
    if (hasUser) {
      throw new NotAcceptableException('Email already exists');
    }

    const settings_id = updateUserDto.settings_id
    delete updateUserDto.settings_id
    delete updateUserDto.password

    const user = await this.modelClass.query().findById(id).update(updateUserDto);

    if (user > 0) {
      let existingUserSettings = []
      let index = -1
      await this.userSettingsService.findAll({ user_id: id }).then((response: any) => {
        response?.results?.map((item: any) => {
          if (settings_id.includes(item?.settings_id)) {
            index = settings_id.indexOf(item?.settings_id)
            settings_id.splice(index, 1)
          } else {
            existingUserSettings.push(item?.id)
          }
        })
      })

      if (settings_id.length > 0) {
        const userSettings = []
        settings_id.map((item) => {
          userSettings.push({
            user_id: id,
            settings_id: item
          })
        })
        await this.userSettingsService.create(userSettings)
      }

      existingUserSettings?.map(async (item: any) => {
        await this.userSettingsService.remove(item)
      })
    }

    return user;
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id);
  }

  async sendMessage(messageDto: SendMessageDto) {
    const message = await this.messageModelClass.query().insert(messageDto).returning('*');
    this.eventsGateway.server.emit(`userID-${messageDto.recipient_id}`, message);
    return message;
  }
}
