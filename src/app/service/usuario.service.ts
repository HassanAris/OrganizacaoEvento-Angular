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
  tipo: string;
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
      tipo: 'Voluntario',
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

  ListarUsuariosPorOrg(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ObterUsuarioOrg/`, { headers: this.getAuthHeaders() });
  }

  GetUsuarioLogado(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ObterUsuarioLogado`, { headers: this.getAuthHeaders() });
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

  atualizarInstituicao(nome: string, email: string){
    return this.http.post(`${this.apiUrl}/AtualizarInstituicaoId?nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}`, {}, { headers: this.getAuthHeaders() });
  }

  logout(): Observable<any> {
    // Passo 1: Remover o token JWT do localStorage
    localStorage.removeItem('jwtToken');  // Ou sessionStorage.removeItem('jwtToken') se você usar sessionStorage

    // Passo 2: Criar as headers de autenticação (caso ainda tenha algum token armazenado que precise ser invalidado no backend)
    const headers = this.getAuthHeaders();  // Presumo que você já tenha uma função para obter os cabeçalhos

    // Passo 3: Chamar o endpoint de logout na API
    return this.http.post(`${this.apiUrl}/Logout`, {}, { headers });
  }

  // Método para obter os cabeçalhos de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Verificar se o token ainda está armazenado
    let headers = new HttpHeaders();

    if (token) {
      // Se o token existir, adicionar ao cabeçalho
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }


}
