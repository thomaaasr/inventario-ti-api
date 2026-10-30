import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { CredenciaisDto } from './dto/credenciais.dto.js';
import { Publico } from './publico.decorator.js';

@ApiTags('Autenticação')
@Publico()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @ApiOperation({ summary: 'Cria um usuário' })
  @ApiCreatedResponse({ description: 'Usuário criado' })
  @ApiBadRequestResponse({ description: 'E-mail inválido ou senha curta' })
  @ApiConflictResponse({ description: 'E-mail já cadastrado' })
  registrar(@Body() credenciais: CredenciaisDto) {
    return this.authService.registrar(credenciais);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Faz login e devolve o token de acesso' })
  @ApiOkResponse({ description: 'Token de acesso (accessToken)' })
  @ApiUnauthorizedResponse({ description: 'E-mail ou senha incorretos' })
  login(@Body() credenciais: CredenciaisDto) {
    return this.authService.login(credenciais);
  }
}
