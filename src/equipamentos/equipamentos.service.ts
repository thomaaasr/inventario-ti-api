import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto.js';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto.js';
import { Equipamento } from './entities/equipamento.entity.js';

@Injectable()
export class EquipamentosService {
  // Por enquanto os dados ficam na memória: somem quando a API reinicia.
  private equipamentos: Equipamento[] = [];
  private proximoId = 1;

  create(createEquipamentoDto: CreateEquipamentoDto): Equipamento {
    const equipamento: Equipamento = {
      id: this.proximoId++,
      ...createEquipamentoDto,
      status: 'disponivel',
    };
    this.equipamentos.push(equipamento);
    return equipamento;
  }

  findAll(): Equipamento[] {
    return this.equipamentos;
  }

  findOne(id: number): Equipamento {
    const equipamento = this.equipamentos.find((e) => e.id === id);
    if (!equipamento) {
      throw new NotFoundException(`Equipamento ${id} não encontrado.`);
    }
    return equipamento;
  }

  update(id: number, updateEquipamentoDto: UpdateEquipamentoDto): Equipamento {
    const equipamento = this.findOne(id);
    Object.assign(equipamento, updateEquipamentoDto);
    return equipamento;
  }

  remove(id: number): void {
    this.findOne(id);
    this.equipamentos = this.equipamentos.filter((e) => e.id !== id);
  }
}