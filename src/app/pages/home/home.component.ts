import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from '../../components/header/header.component';
import { EventoService } from '../../service/evento.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../service/usuario.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  events: any[] = [];
  usuario!: any;
  isLoading: boolean = true;

  constructor(private eventoService: EventoService, private router: Router, private route: ActivatedRoute, private usuarioService: UsuarioService) {}
  async ngOnInit() {

    try {
      // Exibir o loader enquanto a validação ocorre
      this.isLoading = true;

      // Carregar usuário logado
      this.usuario = await this.usuarioService.GetUsuarioLogado().toPromise();

      // Após carregar o usuário, obter eventos
      await this.getEventos();
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar dados do usuário!',
        text: 'Você será redirecionado para o login.',
      }).then(() => {
        this.router.navigate(['/login']);
      });
    } finally {
      // Ocultar o loader
      this.isLoading = false;
    }
  }

  getEventos() {
    return new Promise<void>((resolve, reject) => {
      this.eventoService.obterEventosPorUsuario().subscribe({
        next: (data) => {
          this.events = data;
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar eventos:', err);
          reject(err);
        }
      });
    });
  }
  acceptEvent(event: any) {
    event.isAccepted = true;
  }

  aceitarEvento(eventId: number): void {
    this.eventoService.aceitarEvento(eventId).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Evento Aceito Com Sucesso!',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          const eventoAceito = this.events.find(event => event.id === eventId);
          if (eventoAceito) {
            eventoAceito.isAccepted = true;
            this.getEventos();
          }
        });
      },
      error: (err: { error: any; }) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro Ao Aceitar o Evento!',
          text:  err.error,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  cancelarEvento(eventId: number): void {
    this.eventoService.cancelarEvento(eventId).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Evento Recusado!',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          const eventoAceito = this.events.find(event => event.id === eventId);
          if (eventoAceito) {
            eventoAceito.isAccepted = true;
            this.getEventos();
          }
        });
      },
      error: (err: { error: any; }) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro Ao Recusar o Evento!',
          text:  err.error,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  declineEvent(event: any) {
    // Lógica para recusar o evento
  }

  viewDetails(event: any) {
    // Lógica para visualizar os detalhes do evento
    console.log('Visualizando detalhes do evento:', event);
  }

  navigateToEventos() {
    this.router.navigate(['/gerenciamento-eventos']);
  }


  navigateToHistorico() {
    this.router.navigate(['/historico']);
  }

  navigateToPessoas() {
    this.router.navigate(['/pessoas']);
  }

  navigateToParticipantes() {
    this.router.navigate(['/gerenciar-participantes']);
  }

  visualizarEvento(id: number){
    // Dentro do método ou componente de origem
    this.router.navigate(['/visualizar-evento', id], {
      queryParams: { from: 'home' }  // Passando o parâmetro 'from' que indica de onde está vindo
    });
  }


}
