import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EventoService } from '../../service/evento.service';

export interface TbEvento {
  id?: number; // id é opcional ao criar
  titulo: string;
  descricao?: string;
  data: Date;
  organizadorId?: number;
  status?: string; // Pode ser 'ativo' ou outro status
}


@Component({
  selector: 'app-evento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './evento-modal.component.html',
  styleUrls: ['./evento-modal.component.scss']
})


export class EventoModalComponent {
  event = {
    title: '',
    date: new Date(),
    description: ''
  };
  isModalOpen = false;

  constructor(private fb: FormBuilder, private eventoService: EventoService) {}

  @Output() close = new EventEmitter<void>();
  @Output() eventCreated = new EventEmitter<any>();
  eventos!: TbEvento[];
  eventoForm!: FormGroup;

  onClose() {
    this.close.emit();
  }

  ngOnInit() {
    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descricao: [''],
      data:['']
    });
  }

  onSubmit() {
    this.eventoService.criarEvento(this.eventoForm.value.titulo, this.eventoForm.value.descricao, this.eventoForm.value.data).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Evento Criado Com Sucesso!',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.carregarEventos();
          this.isModalOpen = false;
        });

      },
      error: (err: { error: any; }) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro Ao Criar o Evento!',
          text:  err.error,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  carregarEventos(): void {
    console.log('tetse')
    this.eventoService.obterEventos().subscribe((eventos: TbEvento[]) => {
      this.eventos = eventos;
    });
  }

  deletarEvento(id: number): void {
    this.eventoService.deletarEvento(id).subscribe(() => {
      this.carregarEventos(); // Atualiza a lista após exclusão
    });
  }

}
