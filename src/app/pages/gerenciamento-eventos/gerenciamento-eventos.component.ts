import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { EventoModalComponent } from '../evento-modal/evento-modal.component';
import { EditarEventoModalComponent } from '../editar-evento-modal/editar-evento-modal.component';
import { EventoService } from '../../service/evento.service';


@Component({
  selector: 'app-gerenciamento-eventos',
  standalone: true,
  imports: [CommonModule, FooterComponent, EventoModalComponent, EditarEventoModalComponent],
  templateUrl: './gerenciamento-eventos.component.html',
  styleUrls: ['./gerenciamento-eventos.component.scss']
})
export class GerenciamentoEventosComponent {

  constructor(private eventoService: EventoService) {}

  // events = [
  //   { title: 'Evento 1', date: new Date(), description: 'Descrição do Evento 1', isAccepted: false },
  //   { title: 'Evento 2', date: new Date(), description: 'Descrição do Evento 2', isAccepted: true },
  //   // Adicione mais eventos conforme necessário
  // ];

  events: any[] = [];

  isModalOpen = false;
  modalService: any;
  selectedEvent: any;

  ngOnInit() {
    this.getEventos();
  }

  getEventos() {
    this.eventoService.obterEventos().subscribe({
      next: (data) => {
        console.log(data)
        this.events = data;
          // Apenas para verificar se os dados foram carregados
      },
      error: (err) => {
        console.error('Erro ao carregar eventos:', err);
      }
    });
  }

  openCreateEventModal() {
    this.isModalOpen = true;
  }

  closeCreateEventModal() {
    this.isModalOpen = false;
  }

  addEvent(event: any) {
    this.events.push(event);
    this.closeCreateEventModal();
  }

  viewEventDetails(event: any) {
    // Lógica para visualizar detalhes do evento
  }

  editEvent() {
    this.isModalOpen = true;
  }

  updateEvent(updatedEvent: any) {
    const index = this.events.findIndex(e => e.title === updatedEvent.title && e.date.getTime() === updatedEvent.date.getTime());
    if (index !== -1) {
      this.events[index] = updatedEvent;
    }
  }

}
