import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CreateEquipamentoDto } from './create-equipamento.dto.js';

// "emprestado" fica de fora: só um empréstimo (POST /emprestimos) coloca o equipamento nesse status.
const STATUS_EDITAVEIS = ['disponivel', 'manutencao'] as const;

export class UpdateEquipamentoDto extends PartialType(CreateEquipamentoDto) {
  @ApiPropertyOptional({ enum: STATUS_EDITAVEIS, example: 'manutencao' })
  @IsOptional()
  @IsIn(STATUS_EDITAVEIS, {
    message: 'O status só pode ser alterado para disponivel ou manutencao. Para emprestar, use POST /emprestimos.',
  })
  status?: (typeof STATUS_EDITAVEIS)[number];
}