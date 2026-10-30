import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service.js';
import { Usuario } from './entities/usuario.entity.js';

// Dublê do repositório de usuários.
function criarRepositorioFalso() {
  return {
    existsBy: vi.fn().mockResolvedValue(false),
    findOneBy: vi.fn(),
    create: vi.fn((dados) => ({ ...dados })),
    save: vi.fn(async (usuario) => ({ id: 1, ...usuario })),
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let usuarios: ReturnType<typeof criarRepositorioFalso>;

  beforeEach(async () => {
    usuarios = criarRepositorioFalso();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Usuario), useValue: usuarios },
        { provide: JwtService, useValue: { signAsync: vi.fn().mockResolvedValue('token-de-teste') } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('registrar', () => {
    it('guarda o hash da senha, nunca a senha em si', async () => {
      const resultado = await service.registrar({ email: 'maria@exemplo.com', senha: 'senha-forte-123' });

      const salvo = usuarios.save.mock.calls[0][0];
      expect(salvo.senhaHash).not.toBe('senha-forte-123');
      await expect(bcrypt.compare('senha-forte-123', salvo.senhaHash)).resolves.toBe(true);
      expect(resultado).toEqual({ id: 1, email: 'maria@exemplo.com' });
    });

    it('recusa e-mail repetido com 409', async () => {
      usuarios.existsBy.mockResolvedValue(true);

      await expect(
        service.registrar({ email: 'maria@exemplo.com', senha: 'senha-forte-123' }),
      ).rejects.toThrow(ConflictException);
      expect(usuarios.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('devolve um token quando a senha confere', async () => {
      const senhaHash = await bcrypt.hash('senha-forte-123', 4);
      usuarios.findOneBy.mockResolvedValue({ id: 1, email: 'maria@exemplo.com', senhaHash });

      await expect(
        service.login({ email: 'maria@exemplo.com', senha: 'senha-forte-123' }),
      ).resolves.toEqual({ accessToken: 'token-de-teste' });
    });

    it('recusa senha errada com 401', async () => {
      const senhaHash = await bcrypt.hash('senha-forte-123', 4);
      usuarios.findOneBy.mockResolvedValue({ id: 1, email: 'maria@exemplo.com', senhaHash });

      await expect(
        service.login({ email: 'maria@exemplo.com', senha: 'senha-errada-123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('recusa e-mail que não existe com 401', async () => {
      usuarios.findOneBy.mockResolvedValue(null);

      await expect(
        service.login({ email: 'ninguem@exemplo.com', senha: 'qualquer-senha' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});