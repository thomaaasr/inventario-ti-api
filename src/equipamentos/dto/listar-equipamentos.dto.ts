import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { STATUS_EQUIPAMENTO, type StatusEquipamento } from '../entities/equipamento.entity.js';

// Filtros e paginação da listagem. Tudo chega pela URL, por exemplo:
// GET /equipamentos?status=disponivel&tipo=Notebook&pagina=2&limite=5
export class ListarEquipamentosDto {
  @ApiPropertyOptional({ enum: STATUS_EQUIPAMENTO, description: 'Mostra só os equipamentos com este status' })
  @IsOptional()
  @IsIn(STATUS_EQUIPAMENTO, { message: 'O status precisa ser disponivel, emprestado ou manutencao.' })
  status?: StatusEquipamento;

  @ApiPropertyOptional({ example: 'Notebook', description: 'Mostra só os equipamentos deste tipo' })
  @IsOptional()
  @IsString({ message: 'O tipo precisa ser um texto.' })
  @IsNotEmpty({ message: 'O tipo não pode ser vazio.' })
  tipo?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página precisa ser um número inteiro.' })
  @Min(1, { message: 'A página começa em 1.' })
  pagina: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 50, description: 'Itens por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite precisa ser um número inteiro.' })
  @Min(1, { message: 'O limite precisa ser pelo menos 1.' })
  @Max(50, { message: 'O limite máximo é 50 itens por página.' })
  limite: number = 10;
}