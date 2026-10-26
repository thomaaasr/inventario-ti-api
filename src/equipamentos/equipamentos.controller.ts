import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EquipamentosService } from './equipamentos.service.js';
import { CreateEquipamentoDto } from './dto/create-equipamento.dto.js';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto.js';

@Controller('equipamentos')
export class EquipamentosController {
  constructor(private readonly equipamentosService: EquipamentosService) {}

  @Post()
  create(@Body() createEquipamentoDto: CreateEquipamentoDto) {
    return this.equipamentosService.create(createEquipamentoDto);
  }

  @Get()
  findAll() {
    return this.equipamentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipamentosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEquipamentoDto: UpdateEquipamentoDto) {
    return this.equipamentosService.update(id, updateEquipamentoDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.equipamentosService.remove(id);
  }
}