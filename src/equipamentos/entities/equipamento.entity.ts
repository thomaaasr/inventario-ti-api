export const STATUS_EQUIPAMENTO = ['disponivel', 'emprestado', 'manutencao'] as const;
export type StatusEquipamento = (typeof STATUS_EQUIPAMENTO)[number];

export class Equipamento {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  status: StatusEquipamento;
}