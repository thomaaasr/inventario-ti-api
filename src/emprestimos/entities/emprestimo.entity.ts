import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Equipamento } from '../../equipamentos/entities/equipamento.entity.js';

@Entity()
export class Emprestimo {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Equipamento })
  @ManyToOne(() => Equipamento, { eager: true, nullable: false })
  equipamento: Equipamento;

  @ApiProperty({ example: 'Maria Souza' })
  @Column()
  responsavel: string;

  @ApiProperty({ example: '2026-10-26T14:00:00.000Z' })
  @CreateDateColumn()
  dataEmprestimo: Date;

  @ApiProperty({ example: null, type: Date, nullable: true, description: 'Vazio enquanto o equipamento não for devolvido' })
  @Column({ type: 'datetime', nullable: true })
  dataDevolucao: Date | null;
}