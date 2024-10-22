import { Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { MinioService } from 'src/minio/minio.service';
import { ContactModel } from './contact.model';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @Inject('ContactModel') private modelClass: ModelClass<ContactModel>,
    // private customerContactService: CustomerContactService,
    private readonly minioService: MinioService,
  ) {}

  async create(createContactDto: CreateContactDto, avatar: Express.Multer.File | null) {
    const contact = await this.modelClass.query().where('email', createContactDto.email).find().first();
    if (contact) {
      throw new NotAcceptableException('Email already exists');
    }

    if (avatar && avatar !== undefined) {
      createContactDto.avatar = await this.minioService.uploadFile(avatar);
    } else {
      delete createContactDto.avatar;
    }

    return await this.modelClass.query().insert(createContactDto);
  }

  async import(createContactDtos: CreateContactDto[]) {
    const existingEmails = await this.modelClass
      .query()
      .select('email')
      .whereIn(
        'email',
        createContactDtos.map((dto) => dto.email),
      );

    const contactsToCreate = createContactDtos.filter(
      (dto) => !existingEmails.some((email) => email.email === dto.email),
    );

    if (contactsToCreate?.length === 0) {
      throw new NotFoundException('No new data to import');
    }

    return await this.modelClass.query().insert(contactsToCreate);
  }

  async findAll(params = {}) {
    return await this.modelClass.query().paginate(params).filter(params).find();
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).first().find();
  }

  async findByEmail(email: string) {
    return await this.modelClass.query().where('email', email).first().find();
  }

  async update(id: number, updateContactDto: UpdateContactDto, avatar: Express.Multer.File) {
    const hasContact = await this.modelClass
      .query()
      .where('id', '!=', id)
      .where('email', updateContactDto.email)
      .find()
      .first();
    if (hasContact) {
      throw new NotAcceptableException('Email already exists');
    }

    if (avatar !== undefined) {
      updateContactDto.avatar = await this.minioService.uploadFile(avatar);
    } else {
      delete updateContactDto.avatar;
    }

    return await this.modelClass.query().findById(id).update(updateContactDto);
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id);
  }
}
