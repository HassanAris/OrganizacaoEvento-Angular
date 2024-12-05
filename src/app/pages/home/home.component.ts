import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from '../../components/header/header.component';
import { EventoService } from '../../service/evento.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  events: any[] = [];

  constructor(private eventoService: EventoService, private router: Router) {}

  ngOnInit() {
    this.getEventos();
  }

  getEventos() {
    this.eventoService.obterEventosPorUsuario().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        console.error('Erro ao carregar eventos:', err);
      }
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

  navigateToParticipantes() {
    this.router.navigate(['/gerenciar-participantes']);
  }

  visualizarEvento(id: number){
    this.router.navigate(['/visualizar-evento', id]);
  }


}
