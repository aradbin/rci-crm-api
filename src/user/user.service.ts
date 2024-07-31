import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ModelClass } from 'objection';
import { MinioService } from 'src/minio/minio.service';
import { UserSettingsService } from 'src/user-settings/user-settings.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
    constructor(
        @Inject('UserModel') private modelClass: ModelClass<UserModel>,
        private userSettingsService: UserSettingsService,
        private readonly minioService: MinioService,
    ) {}

    async create(createUserDto: CreateUserDto, avatar: Express.Multer.File) {
        const hasUser = await this.modelClass.query().where('email', createUserDto.email).first();
        if (hasUser) {
            throw new NotAcceptableException('Email already exists');
        }

        if (avatar !== undefined) {
            createUserDto.avatar = await this.minioService.uploadFile(avatar);
        } else {
            delete createUserDto.avatar;
        }
        const hash = bcrypt.hashSync(createUserDto.password, 10);
        const settings_id = createUserDto.settings_id;
        delete createUserDto.settings_id;

        const user = await this.modelClass.query().insert({ ...createUserDto, password: hash });

        if (user?.id && settings_id?.length > 0) {
            const userSettings = [];
            settings_id?.map((item) => {
                userSettings.push({
                    user_id: user.id,
                    settings_id: item,
                });
            });
            await this.userSettingsService.create(userSettings);
        }

        return user;
    }

    async import(createUserDtos: CreateUserDto[]) {
        const existingEmails = await this.modelClass.query().select('email').whereIn('email', createUserDtos.map(dto => dto.email));

        const usersToCreate = createUserDtos.filter(dto => !existingEmails.some(email => email.email === dto.email));

        const hashedUsers = usersToCreate.map(dto => ({
            ...dto,
            password: bcrypt.hashSync(`${dto.password}`, 10)
        }));

        let response = []

        if(hashedUsers?.length > 0){
            response = await this.modelClass.query().insert(hashedUsers);
        }

        return response;
    }

    async findAll(params = {}) {
        const users = (await this.modelClass
            .query()
            .paginate(params)
            .filter(params)
            .withGraphFetched('userSettings.settings')
            .find()) as UserModel[];

        return users;
    }

    async findOne(id: number) {
        const user = await this.modelClass
            .query()
            .findById(id)
            .withGraphFetched('userSettings.settings')
            .first()
            .find();
            
        return user;
    }

    async findByEmail(email: string) {
        return await this.modelClass
            .query()
            .where('email', email)
            .withGraphFetched('userSettings.settings')
            .withGraphFetched('runningTask')
            .first()
            .find();
    }

    async update(id: number, updateUserDto: UpdateUserDto, avatar: Express.Multer.File) {
        const hasUser = await this.modelClass
            .query()
            .where('id', '!=', id)
            .where('email', updateUserDto.email)
            .first()
            .find();
        if (hasUser) {
            throw new NotAcceptableException('Email already exists');
        }

        const newSettingsIds = updateUserDto.settings_id;
        delete updateUserDto.settings_id;
        delete updateUserDto.password;

        if (avatar !== undefined) {
            updateUserDto.avatar = await this.minioService.uploadFile(avatar);
        } else {
            delete updateUserDto.avatar;
        }
        const user = await this.modelClass.query().findById(id).update(updateUserDto);

        if (user > 0) {
            const removableUserSettings = [];
            let index = -1;
            const response: any = await this.userSettingsService.findAll({ user_id: id });
            response?.map((item) => {
                if (newSettingsIds.includes(item?.settings_id)) {
                    index = newSettingsIds.indexOf(item?.settings_id);
                    newSettingsIds.splice(index, 1);
                } else {
                    removableUserSettings.push(item?.id);
                }
            });
            if (newSettingsIds?.length > 0) {
                const userSettings = [];
                newSettingsIds.map((item) => {
                    userSettings.push({
                        user_id: id,
                        settings_id: item,
                    });
                });
                await this.userSettingsService.create(userSettings);
            }
            removableUserSettings?.map(async (item) => {
                await this.userSettingsService.remove(item);
            });
        }

        return user;
    }

    async remove(id: number) {
        return await this.modelClass.query().softDelete(id);
    }
}
