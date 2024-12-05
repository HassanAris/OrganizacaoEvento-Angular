export interface Evento {
  id?: number; // id é opcional ao criar
  titulo: string;
  descricao?: string;
  data: Date;
  organizadorId?: number;
  status?: string; // Pode ser 'ativo' ou outro status
}
