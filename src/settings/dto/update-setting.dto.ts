import { PartialType } from "@nestjs/mapped-types";
import { CreateSettingDto } from "./create-setting.dto";

export class UpdateSettingDto extends PartialType(CreateSettingDto) {
    updated_at: string;
    updated_by: number;
    deleted_at: string;
    deleted_by: number;
}