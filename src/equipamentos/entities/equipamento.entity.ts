import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const STATUS_EQUIPAMENTO = ['disponivel', 'emprestado', 'manutencao'] as const;
export type StatusEquipamento = (typeof STATUS_EQUIPAMENTO)[number];

@Entity()
export class Equipamento {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Notebook' })
  @Column()
  tipo: string;

  @ApiProperty({ example: 'Dell' })
  @Column()
  marca: string;

  @ApiProperty({ example: 'Latitude 5440' })
  @Column()
  modelo: string;

  @ApiProperty({ example: 'ABC123' })
  @Column({ unique: true })
  numeroSerie: string;

  @ApiProperty({ enum: STATUS_EQUIPAMENTO, example: 'disponivel' })
  @Column({ type: 'varchar', default: 'disponivel' })
  status: StatusEquipamento;
}