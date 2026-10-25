export type StatusEquipamento = 'disponivel' | 'emprestado' | 'manutencao';

export class Equipamento {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  status: StatusEquipamento;
}