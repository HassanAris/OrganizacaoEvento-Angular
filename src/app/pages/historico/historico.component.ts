import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { EventoService } from '../../service/evento.service';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss'
})
export class HistoricoComponent {

    constructor(private eventoService: EventoService, private router: Router) {}

    close: any;
    events: any[] = [];
    isModalOpen = false;
    modalService: any;
    selectedEvent: any;
    selectedId: number | null = null;
    isEditMode: boolean = false;
    showModal: boolean = false;

    ngOnInit() {
      this.getEventos();
    }

    getEventos() {
      this.eventoService.obterEventosInativo().subscribe({
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

    navigateToEventos() {
      this.router.navigate(['/gerenciamento-eventos']);
    }

    navigateToHome() {
      this.router.navigate(['/home']);
    }

    navigateToPessoas() {
      this.router.navigate(['/pessoas']);
    }

    navigateToEditar(id: number) {
      this.router.navigate(['/evento-modal', id]);
    }

    visualizarEvento(id: number){
      this.router.navigate(['/visualizar-evento', id], {
        queryParams: { from: 'historico' }
      });
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
