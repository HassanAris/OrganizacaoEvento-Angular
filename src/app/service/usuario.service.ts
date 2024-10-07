import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const usuario: Usuario = {
      nome: '',
      email: email,
      senha: password,
      dataCriacao: new Date().toISOString()
    };

    return this.http.post(`${this.apiUrl}/login`, usuario);
  }

  createUsuario(email: string, password: string): Observable<any> {
    const usuario: Usuario = {
      nome: '',
      email: email,
      senha: password,

      dataCriacao: new Date().toISOString()
    };
    return this.http.post(`${this.apiUrl}/register`, usuario, { responseType: 'text' });
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


  // Outros métodos, se necessário
}
