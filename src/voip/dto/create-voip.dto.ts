import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVoipDto {
    @IsOptional()
    @IsString()
    call_id: string;

    @IsOptional()
    @IsString()
    remote_number: string;

    @IsOptional()
    @IsString()
    local_number: string;

    @IsOptional()
    @IsString()
    log: string;

    @IsOptional()
    @IsNumber()
    received_by: number;

    @IsOptional()
    @IsNumber()
    customer_id: number;

    @IsOptional()
    @IsString()
    note: string;
}
