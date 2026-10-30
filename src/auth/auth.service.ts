import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CredenciaisDto } from './dto/credenciais.dto.js';
import { Usuario } from './entities/usuario.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarios: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async registrar({ email, senha }: CredenciaisDto) {
    if (await this.usuarios.existsBy({ email })) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await this.usuarios.save(this.usuarios.create({ email, senhaHash }));
    return { id: usuario.id, email: usuario.email };
  }

  async login({ email, senha }: CredenciaisDto) {
    const usuario = await this.usuarios.findOneBy({ email });
    // Mesma mensagem nos dois casos, para não revelar quais e-mails existem.
    if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }
    const accessToken = await this.jwtService.signAsync({ sub: usuario.id, email: usuario.email });
    return { accessToken };
  }
}
