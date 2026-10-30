import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEquipamentoDto {
  @ApiProperty({ example: 'Notebook' })
  @IsString({ message: 'O tipo precisa ser um texto.' })
  @IsNotEmpty({ message: 'O tipo é obrigatório.' })
  tipo: string;

  @ApiProperty({ example: 'Dell' })
  @IsString({ message: 'A marca precisa ser um texto.' })
  @IsNotEmpty({ message: 'A marca é obrigatória.' })
  marca: string;

  @ApiProperty({ example: 'Latitude 5440' })
  @IsString({ message: 'O modelo precisa ser um texto.' })
  @IsNotEmpty({ message: 'O modelo é obrigatório.' })
  modelo: string;

  @ApiProperty({ example: 'ABC123', description: 'Único: não pode se repetir entre equipamentos' })
  @IsString({ message: 'O número de série precisa ser um texto.' })
  @IsNotEmpty({ message: 'O número de série é obrigatório.' })
  numeroSerie: string;
}
