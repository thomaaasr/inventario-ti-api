import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EquipamentosService } from './equipamentos.service.js';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto.js';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto.js';
import { Equipamento } from './entities/equipamento.entity.js';

@ApiTags('Equipamentos')
@Controller('equipamentos')
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra um equipamento (começa como disponível)' })
  @ApiCreatedResponse({ type: Equipamento })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou campo desconhecido' })
  @ApiConflictResponse({ description: 'Número de série já cadastrado' })
  create(@Body() createEquipamentoDto: CreateEquipamentoDto) {
    return this.equipamentosService.create(createEquipamentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os equipamentos' })
  @ApiOkResponse({ type: [Equipamento] })
  findAll() {
    return this.equipamentosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mostra um equipamento' })
  @ApiOkResponse({ type: Equipamento })
  @ApiNotFoundResponse({ description: 'Equipamento não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipamentosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edita um equipamento (envie só os campos que mudaram)' })
  @ApiOkResponse({ type: Equipamento })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou campo desconhecido' })
  @ApiNotFoundResponse({ description: 'Equipamento não encontrado' })
  @ApiConflictResponse({ description: 'Número de série já cadastrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEquipamentoDto: UpdateEquipamentoDto) {
    return this.equipamentosService.update(id, updateEquipamentoDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Exclui um equipamento' })
  @ApiNoContentResponse({ description: 'Excluído' })
  @ApiNotFoundResponse({ description: 'Equipamento não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.equipamentosService.remove(id);
  }
}