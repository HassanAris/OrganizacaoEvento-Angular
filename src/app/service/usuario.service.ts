import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Define o modelo que será enviado
export interface Usuario {
  nome: string;
  email: string;
  senha: string;
  dataCriacao: string; // ou Date se você preferir
}

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private apiUrl = `${environment.apiBaseUrl}/Usuarios`; // URL da sua API
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const usuario = {
      email: email,
      senha: password,
    };
    return this.http.post(`${this.apiUrl}/login`, usuario);
  }

  createUsuario(email: string, password: string, username: string): Observable<any> {
    const usuario: Usuario = {
      nome: username,
      email: email,
      senha: password,
      dataCriacao: new Date().toISOString()
    };
    return this.http.post(`${this.apiUrl}/register`, usuario, { responseType: 'text' });
  }

  GetUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ObterUsuarios`, { responseType: 'text' });
  }

  ListarUsuariosPorEvento(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ListarUsuariosPorEvento/${id}`, { headers: this.getAuthHeaders() });
  }

  gerarToken(email: string){
    this.http.post(`${this.apiUrl}/GerarToken?email=${encodeURIComponent(email)}`, null).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
      },
      error: (err) => {
        console.error('Erro ao gerar token:', err);
      }
    });
    return true;
  }

  getAuthHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Adicione o token no cabeçalho
    });
  }


}
