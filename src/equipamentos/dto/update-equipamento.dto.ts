import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateEquipamentoDto } from './create-equipamento.dto.js';
import { STATUS_EQUIPAMENTO, type StatusEquipamento } from '../entities/equipamento.entity.js';

export class UpdateEquipamentoDto extends PartialType(CreateEquipamentoDto) {
  @IsOptional()
  @IsIn(STATUS_EQUIPAMENTO, { message: 'O status precisa ser disponivel, emprestado ou manutencao.' })
  status?: StatusEquipamento;
}