import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CredenciaisDto {
  @ApiProperty({ example: 'maria@exemplo.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @ApiProperty({ example: 'senha-forte-123', minLength: 8 })
  @IsString({ message: 'A senha precisa ser um texto.' })
  @MinLength(8, { message: 'A senha precisa ter pelo menos 8 caracteres.' })
  senha: string;
}