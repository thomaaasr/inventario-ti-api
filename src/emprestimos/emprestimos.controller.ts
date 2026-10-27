import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEmprestimoDto } from './dto/create-emprestimo.dto.js';
import { Emprestimo } from './entities/emprestimo.entity.js';
import { EmprestimosService } from './emprestimos.service.js';

@ApiTags('Empréstimos')
@Controller('emprestimos')
export class EmprestimosController {
  constructor(private readonly emprestimosService: EmprestimosService) {}

  @Post()
  @ApiOperation({ summary: 'Empresta um equipamento disponível' })
  @ApiCreatedResponse({ type: Emprestimo })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou campo desconhecido' })
  @ApiNotFoundResponse({ description: 'Equipamento não encontrado' })
  @ApiConflictResponse({ description: 'Equipamento não está disponível' })
  emprestar(@Body() createEmprestimoDto: CreateEmprestimoDto) {
    return this.emprestimosService.emprestar(createEmprestimoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista os empréstimos, do mais recente ao mais antigo' })
  @ApiQuery({ name: 'equipamentoId', required: false, description: 'Mostra só o histórico deste equipamento' })
  @ApiOkResponse({ type: [Emprestimo] })
  findAll(@Query('equipamentoId', new ParseIntPipe({ optional: true })) equipamentoId?: number) {
    return this.emprestimosService.findAll(equipamentoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mostra um empréstimo' })
  @ApiOkResponse({ type: Emprestimo })
  @ApiNotFoundResponse({ description: 'Empréstimo não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.emprestimosService.findOne(id);
  }

  @Patch(':id/devolucao')
  @ApiOperation({ summary: 'Registra a devolução e libera o equipamento' })
  @ApiOkResponse({ type: Emprestimo })
  @ApiNotFoundResponse({ description: 'Empréstimo não encontrado' })
  @ApiConflictResponse({ description: 'Empréstimo já devolvido' })
  devolver(@Param('id', ParseIntPipe) id: number) {
    return this.emprestimosService.devolver(id);
  }
}