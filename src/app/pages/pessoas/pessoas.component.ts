import { AdicionarPessoaComponent } from './../adicionar-pessoa/adicionar-pessoa.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-pessoas',
  standalone: true,
  imports: [CommonModule, FooterComponent, AdicionarPessoaComponent, HeaderComponent],
  templateUrl: './pessoas.component.html',
  styleUrl: './pessoas.component.scss'
})
export class PessoasComponent {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  usuarios: any[] = [];
  isModalOpen = false;

  ngOnInit() {
    this.listarUsuariosPorOrg();
  }

  listarUsuariosPorOrg(){
    this.usuarioService.ListarUsuariosPorOrg().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Erro ao carregar eventos:', err);
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  addEvent() {
    this.openModal();
  }

  closeModal() {
    this.isModalOpen = false;
  }
  navigateToEventos() {
    this.router.navigate(['/gerenciamento-eventos']);
  }

  navigateToPessoas() {
    this.router.navigate(['/pessoas']);
  }

  visualizarEvento(id: number){
    this.router.navigate(['/visualizar-evento', id]);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToHistorico() {
    this.router.navigate(['/historico']);
  }


}
