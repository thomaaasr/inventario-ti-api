import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Equipamento, StatusEquipamento } from '../equipamentos/entities/equipamento.entity.js';
import { EmprestimosService } from './emprestimos.service.js';
import { Emprestimo } from './entities/emprestimo.entity.js';

// Dublê do "manager" da transação: imita o banco sem precisar de um banco de verdade.
function criarManagerFalso() {
  return {
    findOneBy: vi.fn(),
    create: vi.fn((_entidade, dados) => ({ ...dados })),
    save: vi.fn(async (registro) => registro),
  };
}

function criarNotebook(status: StatusEquipamento = 'disponivel'): Equipamento {
  return { id: 1, tipo: 'Notebook', marca: 'Dell', modelo: 'Latitude 5440', numeroSerie: 'ABC123', status };
}

describe('EmprestimosService', () => {
  let service: EmprestimosService;
  let manager: ReturnType<typeof criarManagerFalso>;

  beforeEach(async () => {
    manager = criarManagerFalso();
    // A transação falsa só executa a função recebida, entregando o manager falso.
    const dataSource = { transaction: vi.fn((funcao) => funcao(manager)) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmprestimosService,
        { provide: getRepositoryToken(Emprestimo), useValue: {} },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<EmprestimosService>(EmprestimosService);
  });

  describe('emprestar', () => {
    it('empresta um equipamento disponível e o marca como emprestado', async () => {
      manager.findOneBy.mockResolvedValue(criarNotebook());

      const emprestimo = await service.emprestar({ equipamentoId: 1, responsavel: 'Maria Souza' });

      expect(emprestimo.responsavel).toBe('Maria Souza');
      expect(emprestimo.equipamento.status).toBe('emprestado');
      expect(manager.save).toHaveBeenCalledTimes(2);
    });

    it('responde 404 quando o equipamento não existe', async () => {
      manager.findOneBy.mockResolvedValue(null);

      await expect(service.emprestar({ equipamentoId: 99, responsavel: 'Maria Souza' })).rejects.toThrow(
        NotFoundException,
      );
      expect(manager.save).not.toHaveBeenCalled();
    });

    it('recusa emprestar um equipamento que não está disponível', async () => {
      manager.findOneBy.mockResolvedValue(criarNotebook('manutencao'));

      await expect(service.emprestar({ equipamentoId: 1, responsavel: 'Maria Souza' })).rejects.toThrow(
        ConflictException,
      );
      expect(manager.save).not.toHaveBeenCalled();
    });
  });

  describe('devolver', () => {
    it('registra a devolução e libera o equipamento', async () => {
      const emprestimo = {
        id: 1,
        responsavel: 'Maria Souza',
        dataDevolucao: null,
        equipamento: criarNotebook('emprestado'),
      };
      manager.findOneBy.mockResolvedValue(emprestimo);

      const resultado = await service.devolver(1);

      expect(resultado.dataDevolucao).toBeInstanceOf(Date);
      expect(resultado.equipamento.status).toBe('disponivel');
    });

    it('responde 404 quando o empréstimo não existe', async () => {
      manager.findOneBy.mockResolvedValue(null);

      await expect(service.devolver(99)).rejects.toThrow(NotFoundException);
    });

    it('recusa devolver duas vezes', async () => {
      manager.findOneBy.mockResolvedValue({ id: 1, dataDevolucao: new Date(), equipamento: criarNotebook() });

      await expect(service.devolver(1)).rejects.toThrow(ConflictException);
      expect(manager.save).not.toHaveBeenCalled();
    });
  });
});
