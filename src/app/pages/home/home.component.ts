import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  events = [
    { title: 'Evento 1', date: new Date(), description: 'Descrição do Evento 1', isAccepted: false },
    { title: 'Evento 2', date: new Date(), description: 'Descrição do Evento 2', isAccepted: true },
    // Adicione mais eventos conforme necessário
  ];

  constructor(private router: Router) {}

  acceptEvent(event: any) {
    event.isAccepted = true;
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
}
