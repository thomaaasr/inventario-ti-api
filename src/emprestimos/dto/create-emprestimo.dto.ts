import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateEmprestimoDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'O equipamentoId precisa ser um número inteiro.' })
  @Min(1, { message: 'O equipamentoId precisa ser maior que zero.' })
  equipamentoId: number;

  @ApiProperty({ example: 'Maria Souza', description: 'Quem está levando o equipamento' })
  @IsString({ message: 'O responsável precisa ser um texto.' })
  @IsNotEmpty({ message: 'O responsável é obrigatório.' })
  responsavel: string;
}
