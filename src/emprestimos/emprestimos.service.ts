import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Equipamento } from '../equipamentos/entities/equipamento.entity.js';
import { CreateEmprestimoDto } from './dto/create-emprestimo.dto.js';
import { Emprestimo } from './entities/emprestimo.entity.js';

@Injectable()
export class EmprestimosService {
  constructor(
    @InjectRepository(Emprestimo)
    private readonly emprestimos: Repository<Emprestimo>,
    private readonly dataSource: DataSource,
  ) {}

  // Empresta e marca o equipamento como emprestado numa única transação:
  // ou as duas gravações acontecem, ou nenhuma.
  emprestar(createEmprestimoDto: CreateEmprestimoDto): Promise<Emprestimo> {
    return this.dataSource.transaction(async (manager) => {
      const { equipamentoId, responsavel } = createEmprestimoDto;
      const equipamento = await manager.findOneBy(Equipamento, { id: equipamentoId });
      if (!equipamento) {
        throw new NotFoundException(`Equipamento ${equipamentoId} não encontrado.`);
      }
      if (equipamento.status !== 'disponivel') {
        throw new ConflictException(
          `O equipamento ${equipamentoId} não está disponível (status atual: ${equipamento.status}).`,
        );
      }

      equipamento.status = 'emprestado';
      await manager.save(equipamento);
      return manager.save(manager.create(Emprestimo, { equipamento, responsavel }));
    });
  }

  devolver(id: number): Promise<Emprestimo> {
    return this.dataSource.transaction(async (manager) => {
      const emprestimo = await manager.findOneBy(Emprestimo, { id });
      if (!emprestimo) {
        throw new NotFoundException(`Empréstimo ${id} não encontrado.`);
      }
      if (emprestimo.dataDevolucao) {
        throw new ConflictException(`O empréstimo ${id} já foi devolvido.`);
      }

      emprestimo.dataDevolucao = new Date();
      emprestimo.equipamento.status = 'disponivel';
      await manager.save(emprestimo.equipamento);
      return manager.save(emprestimo);
    });
  }

  findAll(equipamentoId?: number): Promise<Emprestimo[]> {
    return this.emprestimos.find({
      where: equipamentoId ? { equipamento: { id: equipamentoId } } : {},
      order: { dataEmprestimo: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Emprestimo> {
    const emprestimo = await this.emprestimos.findOneBy({ id });
    if (!emprestimo) {
      throw new NotFoundException(`Empréstimo ${id} não encontrado.`);
    }
    return emprestimo;
  }
}
