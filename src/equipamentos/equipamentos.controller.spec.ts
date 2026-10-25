import { Test, TestingModule } from '@nestjs/testing';
import { EquipamentosController } from './equipamentos.controller.js';
import { EquipamentosService } from './equipamentos.service.js';

describe('EquipamentosController', () => {
  let controller: EquipamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipamentosController],
      providers: [EquipamentosService],
    }).compile();

    controller = module.get<EquipamentosController>(EquipamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
