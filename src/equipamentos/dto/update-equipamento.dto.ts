import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipamentoDto } from './create-equipamento.dto.js';

export class UpdateEquipamentoDto extends PartialType(CreateEquipamentoDto) {}
