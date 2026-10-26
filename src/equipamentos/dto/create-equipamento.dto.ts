import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEquipamentoDto {
  @IsString({ message: 'O tipo precisa ser um texto.' })
  @IsNotEmpty({ message: 'O tipo é obrigatório.' })
  tipo: string;

  @IsString({ message: 'A marca precisa ser um texto.' })
  @IsNotEmpty({ message: 'A marca é obrigatória.' })
  marca: string;

  @IsString({ message: 'O modelo precisa ser um texto.' })
  @IsNotEmpty({ message: 'O modelo é obrigatório.' })
  modelo: string;

  @IsString({ message: 'O número de série precisa ser um texto.' })
  @IsNotEmpty({ message: 'O número de série é obrigatório.' })
  numeroSerie: string;
}