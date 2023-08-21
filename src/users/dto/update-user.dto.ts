import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    updated_at: string;
    updated_by: number;
    deleted_at: string;
    deleted_by: number;
}