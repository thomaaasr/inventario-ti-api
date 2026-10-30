import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EquipamentosService } from './equipamentos.service.js';
import { Equipamento, StatusEquipamento } from './entities/equipamento.entity.js';
import { Emprestimo } from '../emprestimos/entities/emprestimo.entity.js';

// Dublê do repositório: imita o banco sem precisar de um banco de verdade.
function criarRepositorioFalso() {
  return {
    create: vi.fn((dados) => ({ ...dados })),
    save: vi.fn(async (equipamento) => ({ id: 1, status: 'disponivel', ...equipamento })),
    find: vi.fn(),
    findAndCount: vi.fn(),
    findOneBy: vi.fn(),
    existsBy: vi.fn(),
    remove: vi.fn(),
  };
}

// Cria um notebook novo a cada chamada, para um teste nunca alterar o objeto de outro.
function criarNotebook(status: StatusEquipamento = 'disponivel'): Equipamento {
  return {
    id: 1,
    tipo: 'Notebook',
    marca: 'Dell',
    modelo: 'Latitude 5440',
    numeroSerie: 'ABC123',
    status,
  };
}

const notebook = criarNotebook();

describe('EquipamentosService', () => {
  let service: EquipamentosService;
  let repositorio: ReturnType<typeof criarRepositorioFalso>;
  let emprestimos: { existsBy: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    repositorio = criarRepositorioFalso();
    emprestimos = { existsBy: vi.fn().mockResolvedValue(false) };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipamentosService,
        { provide: getRepositoryToken(Equipamento), useValue: repositorio },
        { provide: getRepositoryToken(Emprestimo), useValue: emprestimos },
      ],
    }).compile();

    service = module.get<EquipamentosService>(EquipamentosService);
  });

  describe('create', () => {
    it('cadastra quando o número de série está livre', async () => {
      repositorio.existsBy.mockResolvedValue(false);
      const dados = { tipo: 'Notebook', marca: 'Dell', modelo: 'Latitude 5440', numeroSerie: 'ABC123' };

      const resultado = await service.create(dados);

      expect(repositorio.save).toHaveBeenCalledWith(dados);
      expect(resultado).toEqual(notebook);
    });

    it('recusa número de série repetido com 409', async () => {
      repositorio.existsBy.mockResolvedValue(true);

      await expect(
        service.create({ tipo: 'Monitor', marca: 'LG', modelo: '24MK430', numeroSerie: 'ABC123' }),
      ).rejects.toThrow(ConflictException);
      expect(repositorio.save).not.toHaveBeenCalled();
    });
  });

    describe('findAll', () => {
    it('busca só a página pedida, com os filtros enviados', async () => {
      repositorio.findAndCount.mockResolvedValue([[notebook], 11]);

      const resultado = await service.findAll({ status: 'disponivel', pagina: 2, limite: 5 });

      expect(repositorio.findAndCount).toHaveBeenCalledWith({
        where: { status: 'disponivel' },
        order: { id: 'ASC' },
        skip: 5,
        take: 5,
      });
      expect(resultado).toEqual({ itens: [notebook], total: 11, pagina: 2, limite: 5 });
    });
  });

  describe('findOne', () => {
    it('devolve o equipamento encontrado', async () => {
      repositorio.findOneBy.mockResolvedValue(notebook);

      await expect(service.findOne(1)).resolves.toEqual(notebook);
    });

    it('responde 404 quando o equipamento não existe', async () => {
      repositorio.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('altera só os campos enviados', async () => {
      repositorio.findOneBy.mockResolvedValue(criarNotebook());

      const resultado = await service.update(1, { status: 'manutencao' });

      expect(resultado).toEqual(criarNotebook('manutencao'));
      expect(repositorio.existsBy).not.toHaveBeenCalled();
    });

    it('recusa trocar para um número de série que já existe', async () => {
      repositorio.findOneBy.mockResolvedValue(criarNotebook());
      repositorio.existsBy.mockResolvedValue(true);

      await expect(service.update(1, { numeroSerie: 'XYZ789' })).rejects.toThrow(ConflictException);
      expect(repositorio.save).not.toHaveBeenCalled();
    });

    it('recusa mudar o status de um equipamento emprestado', async () => {
      repositorio.findOneBy.mockResolvedValue(criarNotebook('emprestado'));

      await expect(service.update(1, { status: 'disponivel' })).rejects.toThrow(ConflictException);
      expect(repositorio.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('exclui o equipamento encontrado', async () => {
      repositorio.findOneBy.mockResolvedValue(notebook);

      await service.remove(1);

      expect(repositorio.remove).toHaveBeenCalledWith(notebook);
    });

    it('responde 404 ao excluir um equipamento que não existe', async () => {
      repositorio.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(repositorio.remove).not.toHaveBeenCalled();
    });

    it('recusa excluir um equipamento com histórico de empréstimos', async () => {
      repositorio.findOneBy.mockResolvedValue(notebook);
      emprestimos.existsBy.mockResolvedValue(true);

      await expect(service.remove(1)).rejects.toThrow(ConflictException);
      expect(repositorio.remove).not.toHaveBeenCalled();
    });
  });
});