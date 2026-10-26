import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const STATUS_EQUIPAMENTO = ['disponivel', 'emprestado', 'manutencao'] as const;
export type StatusEquipamento = (typeof STATUS_EQUIPAMENTO)[number];

@Entity()
export class Equipamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column({ unique: true })
  numeroSerie: string;

  @Column({ type: 'varchar', default: 'disponivel' })
  status: StatusEquipamento;
}