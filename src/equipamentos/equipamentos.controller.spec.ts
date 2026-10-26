import { Test, TestingModule } from '@nestjs/testing';
import { EquipamentosController } from './equipamentos.controller.js';
import { EquipamentosService } from './equipamentos.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Equipamento } from './entities/equipamento.entity.js';

describe('EquipamentosController', () => {
  let controller: EquipamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipamentosController],
      providers: [EquipamentosService, { provide: getRepositoryToken(Equipamento), useValue: {} }],
    }).compile();

    controller = module.get<EquipamentosController>(EquipamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
