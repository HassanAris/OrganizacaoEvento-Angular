import { Component } from '@angular/core';
import { UsuarioService } from '../../service/usuario.service';
import { Usuario } from '../../models/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor( private usuarioService: UsuarioService, private router: Router) {}
  usuario?: Usuario;

  ngOnInit() {
    this.getUsuarioLogado();
  }

  getUsuarioLogado(){
    this.usuarioService.GetUsuarioLogado().subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Erro ao carregar usuario:', err.message);
      }
    });
  }

  logout(): void {
    this.usuarioService.logout().subscribe(
      (response) => {
        console.error('Erro ao tentar fazer logout:', response);
      },
      (error) => {
        // Se o logout for bem-sucedido, redirecione para a página de login
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    );

  }

}
