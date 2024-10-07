
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TbEvento {
  id?: number; // id é opcional ao criar
  titulo: string;
  descricao?: string;
  data: Date;
  organizadorId?: number;
  status?: string; // Pode ser 'ativo' ou outro status
}

@Injectable({
  providedIn: 'root'
})

export class EventoService {
  token = localStorage.getItem('token');
  private apiUrl = `${environment.apiBaseUrl}/Eventos`; // URL da sua API


  constructor(private http: HttpClient) {}

  criarEvento(titulo:string, descricao: string, data: string): Observable<TbEvento> {
    const evento: TbEvento = {
      titulo: titulo,
      data: new Date(data),
      descricao: descricao,
      status: 'Aguardando Confirmação'
    }
    return this.http.post<TbEvento>(`${this.apiUrl}/CriarEvento`, evento, { headers: this.getAuthHeaders() } );
  }

  obterEventos(): Observable<TbEvento[]> {
    return this.http.get<TbEvento[]>(`${this.apiUrl}/ObterEventos`,  { headers: this.getAuthHeaders() });
  }

  obterEventoPorId(id: number): Observable<TbEvento> {
    return this.http.get<TbEvento>(`${this.apiUrl}/${id}`);
  }

  atualizarEvento(evento: TbEvento): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${evento.id}`, evento);
  }

  deletarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAuthHeaders() {

    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Adicione o token no cabeçalho
    });
  }
}
