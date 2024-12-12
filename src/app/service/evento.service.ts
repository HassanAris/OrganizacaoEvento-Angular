
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Evento } from '../models/evento';
import { Usuario } from './usuario.service';

@Injectable({
  providedIn: 'root'
})

export class EventoService {
  token = localStorage.getItem('token');
  private apiUrl = `${environment.apiBaseUrl}/Eventos`;

  constructor(private http: HttpClient) {}

  criarEventoEditar(evento: any, usuarios: any[], isEdit: boolean): Observable<any> {
    if(isEdit == false){
      const dto = {
        Evento: {
          Titulo: evento.value.titulo,
          Data: new Date(evento.value.data),
          Descricao: evento.value.descricao,
          Status: 'Ativo'
        },
        Usuarios: usuarios.map((usuario: any) => ({
          Id: usuario.id,
          Nome: usuario.nome
        }))
      };
      // Envia os dados para a API
      return this.http.post(`${this.apiUrl}/CriarEvento`, dto, {headers: this.getAuthHeaders()});
    }else{
      const dto = {
        Evento: {
          id: evento.value.id,
          Titulo: evento.value.titulo,
          Data: new Date(evento.value.data),
          Descricao: evento.value.descricao,
          Status: 'Ativo'
        },
        Usuarios: usuarios.map((usuario: any) => ({
          Id: usuario.id,
          Nome: usuario.nome
        }))
      };
      // Envia os dados para a API
      return this.http.post(`${this.apiUrl}/EditarEvento`, dto, {headers: this.getAuthHeaders()});
    }
  }

  obterEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/ObterEventos`,  { headers: this.getAuthHeaders() });
  }

  obterEventosInativo(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/ObterEventosInativo`,  { headers: this.getAuthHeaders() });
  }

  obterEventosPorUsuario(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/ObterEventosUsuario`,  { headers: this.getAuthHeaders() });
  }

  aceitarEvento(id: number): Observable<any> {
    const url = `${this.apiUrl}/AceitarOuRecusarEvento/${id}?status=Aceito`;
    return this.http.post<any>(url, {}, { headers: this.getAuthHeaders() });
  }

  cancelarEvento(id: number): Observable<any> {
    const url = `${this.apiUrl}/AceitarOuRecusarEvento/${id}?status=Recusado`;
    return this.http.post<any>(url, {}, { headers: this.getAuthHeaders() });
  }

  obterEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  atualizarEvento(evento: Evento): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${evento.id}`, evento);
  }

  deletarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getAuthHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Adicione o token no cabeçalho
    });
  }
}
