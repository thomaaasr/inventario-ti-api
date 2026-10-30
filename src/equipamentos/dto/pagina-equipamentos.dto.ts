import { ApiProperty } from '@nestjs/swagger';
import { Equipamento } from '../entities/equipamento.entity.js';

// Formato da resposta da listagem: os itens da página e as informações para navegar.
export class PaginaEquipamentosDto {
  @ApiProperty({ type: [Equipamento] })
  itens: Equipamento[];

  @ApiProperty({ example: 23, description: 'Total de equipamentos que atendem aos filtros' })
  total: number;

  @ApiProperty({ example: 1 })
  pagina: number;

  @ApiProperty({ example: 10 })
  limite: number;
}