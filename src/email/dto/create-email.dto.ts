import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEmailDto {
  @IsNotEmpty({ message: "Recipient email is required" })
  @IsEmail({}, { message: "Please provide valid email address" })
  toEmail: string;

  @IsNotEmpty({ message: "Email subject is required" })
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  html: string;
}
