import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto.js';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto.js';
import { Equipamento } from './entities/equipamento.entity.js';
import { Emprestimo } from '../emprestimos/entities/emprestimo.entity.js';

@Injectable()
export class EquipamentosService {
  constructor(
    @InjectRepository(Equipamento)
    private readonly equipamentos: Repository<Equipamento>,
    @InjectRepository(Emprestimo)
    private readonly emprestimos: Repository<Emprestimo>,
  ) {}

  async create(createEquipamentoDto: CreateEquipamentoDto): Promise<Equipamento> {
    await this.garantirNumeroSerieLivre(createEquipamentoDto.numeroSerie);
    const equipamento = this.equipamentos.create(createEquipamentoDto);
    return this.equipamentos.save(equipamento);
  }

  findAll(): Promise<Equipamento[]> {
    return this.equipamentos.find();
  }

  async findOne(id: number): Promise<Equipamento> {
    const equipamento = await this.equipamentos.findOneBy({ id });
    if (!equipamento) {
      throw new NotFoundException(`Equipamento ${id} não encontrado.`);
    }
    return equipamento;
  }

  async update(id: number, updateEquipamentoDto: UpdateEquipamentoDto): Promise<Equipamento> {
    const equipamento = await this.findOne(id);
    if (updateEquipamentoDto.status && equipamento.status === 'emprestado') {
      throw new ConflictException(
        `O equipamento ${id} está emprestado. Registre a devolução em PATCH /emprestimos/{id}/devolucao.`,
      );
    }
    if (updateEquipamentoDto.numeroSerie && updateEquipamentoDto.numeroSerie !== equipamento.numeroSerie) {
      await this.garantirNumeroSerieLivre(updateEquipamentoDto.numeroSerie);
    }
    Object.assign(equipamento, updateEquipamentoDto);
    return this.equipamentos.save(equipamento);
  }

  async remove(id: number): Promise<void> {
    const equipamento = await this.findOne(id);
    if (await this.emprestimos.existsBy({ equipamento: { id } })) {
      throw new ConflictException(
        `O equipamento ${id} tem histórico de empréstimos e não pode ser excluído, para não apagar o histórico.`,
      );
    }
    await this.equipamentos.remove(equipamento);
  }

  private async garantirNumeroSerieLivre(numeroSerie: string): Promise<void> {
    if (await this.equipamentos.existsBy({ numeroSerie })) {
      throw new ConflictException(`Já existe um equipamento com o número de série ${numeroSerie}.`);
    }
  }
}