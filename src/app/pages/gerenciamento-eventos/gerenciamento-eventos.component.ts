import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { EventoModalComponent } from '../evento-modal/evento-modal.component';
import { EventoService } from '../../service/evento.service';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gerenciamento-eventos',
  standalone: true,
  imports: [CommonModule, FooterComponent, EventoModalComponent, HeaderComponent],
  templateUrl: './gerenciamento-eventos.component.html',
  styleUrls: ['./gerenciamento-eventos.component.scss']
})
export class GerenciamentoEventosComponent {
  close: any;


  constructor(private eventoService: EventoService, private router: Router) {}

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
        this.events = data;
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
  selectedId: number | null = null;
  isEditMode: boolean = false;
  showModal: boolean = false;

  openModal(id?: number) {
    this.selectedId = id || null; // Armazena o ID selecionado ou null
    this.isEditMode = !!id; // Define o modo com base na presença do ID
    this.showModal = true; // Exibe a modal
  }

  closeModal() {
    this.showModal = false;
  }

  editEvent() {
    this.isModalOpen = true;
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToEditar(id: number) {
    this.router.navigate(['/evento-modal', id]);
  }

  deletarEvento(id: number): void {
    this.eventoService.deletarEvento(id).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Evento Excluido Com Sucesso!',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
            this.getEventos();
        });
      },
      error: (err: { error: any; }) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro Ao Excluir o Evento!',
          text:  err.error,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  updateEvent(updatedEvent: any) {
    const index = this.events.findIndex(e => e.title === updatedEvent.title && e.date.getTime() === updatedEvent.date.getTime());
    if (index !== -1) {
      this.events[index] = updatedEvent;
    }
  }

}
