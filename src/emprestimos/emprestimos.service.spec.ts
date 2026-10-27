import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EmprestimosService } from './emprestimos.service.js';
import { Emprestimo } from './entities/emprestimo.entity.js';

describe('EmprestimosService', () => {
  let service: EmprestimosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmprestimosService,
        { provide: getRepositoryToken(Emprestimo), useValue: {} },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    service = module.get<EmprestimosService>(EmprestimosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});