import { Test, TestingModule } from '@nestjs/testing';
import { EquipamentosService } from './equipamentos.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Equipamento } from './entities/equipamento.entity.js';

describe('EquipamentosService', () => {
  let service: EquipamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipamentosService, { provide: getRepositoryToken(Equipamento), useValue: {} }],
    }).compile();

    service = module.get<EquipamentosService>(EquipamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
