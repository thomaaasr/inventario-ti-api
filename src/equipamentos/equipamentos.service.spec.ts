import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EquipamentosService } from './equipamentos.service.js';
import { Equipamento } from './entities/equipamento.entity.js';

// Dublê do repositório: imita o banco sem precisar de um banco de verdade.
function criarRepositorioFalso() {
  return {
    create: vi.fn((dados) => ({ ...dados })),
    save: vi.fn(async (equipamento) => ({ id: 1, status: 'disponivel', ...equipamento })),
    find: vi.fn(),
    findOneBy: vi.fn(),
    existsBy: vi.fn(),
    remove: vi.fn(),
  };
}

const notebook: Equipamento = {
  id: 1,
  tipo: 'Notebook',
  marca: 'Dell',
  modelo: 'Latitude 5440',
  numeroSerie: 'ABC123',
  status: 'disponivel',
};

describe('EquipamentosService', () => {
  let service: EquipamentosService;
  let repositorio: ReturnType<typeof criarRepositorioFalso>;

  beforeEach(async () => {
    repositorio = criarRepositorioFalso();
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipamentosService, { provide: getRepositoryToken(Equipamento), useValue: repositorio }],
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
      repositorio.findOneBy.mockResolvedValue({ ...notebook });

      const resultado = await service.update(1, { status: 'emprestado' });

      expect(resultado).toEqual({ ...notebook, status: 'emprestado' });
      expect(repositorio.existsBy).not.toHaveBeenCalled();
    });

    it('recusa trocar para um número de série que já existe', async () => {
      repositorio.findOneBy.mockResolvedValue({ ...notebook });
      repositorio.existsBy.mockResolvedValue(true);

      await expect(service.update(1, { numeroSerie: 'XYZ789' })).rejects.toThrow(ConflictException);
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
  });
});