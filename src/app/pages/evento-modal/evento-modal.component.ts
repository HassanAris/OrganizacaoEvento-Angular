import { UsuarioService } from './../../service/usuario.service';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EventoService } from '../../service/evento.service';
import { Evento } from '../../models/evento';
import { Usuario } from '../../models/usuario';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule ],
  templateUrl: './evento-modal.component.html',
  styleUrls: ['./evento-modal.component.scss']
})

export class EventoModalComponent {
  isModalOpen = false;

  constructor(private fb: FormBuilder, private eventoService: EventoService, private usuarioService: UsuarioService, private activatedRoute: ActivatedRoute) {}

  @Output() close = new EventEmitter<void>();
  @Output() eventCreated = new EventEmitter<any>();
  @Input() id: number | null = null;
  @Input() isEditMode: boolean = false;
  eventos!: Evento[];
  usuarios!: Usuario[];
  eventoForm!: FormGroup;
  selectedPeople: number[] = [];
  selectedLabels: { id: number, nome: string }[] = [];
  dropdownOpen: boolean = false;
  evento: any
  usuariosEditar: any[] = [];

  ngOnInit() {
    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descricao: [''],
      data:[''],
      selectedLabels: [[]]
    });
    this.GetUsuarios();
    if (this.isEditMode && this.id) {
      // console.log(this.id)
      this.carregaInfoEvento(this.id);

    }

    if (this.evento) {
      // Se houver um evento, preenche o formulário com os dados do evento
      this.isEditMode = true;
      this.eventoForm.patchValue({
        titulo: this.evento.titulo,
        data: this.evento.data.ToString("yyyy-MM-dd"),
        descricao: this.evento.descricao
      });
    }
  }

  closeModal() {
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.eventoService.criarEventoEditar(this.eventoForm,this.selectedLabels ).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Evento Criado Com Sucesso!',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.eventCreated.emit();
          this.onClose();
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
    this.eventoService.obterEventos().subscribe((eventos: Evento[]) => {
      this.eventos = eventos;
    });
  }

  GetUsuarios() {
        this.usuarioService.GetUsuarios().subscribe((usuarios: any) => {
      if (typeof usuarios === 'string') {
        try {
          usuarios = JSON.parse(usuarios); // Se for uma string JSON, faça o parsing
        } catch (error) {
          console.error('Erro ao parsear a resposta JSON:', error);
        }
      }
      if (Array.isArray(usuarios)) {
        this.usuarios = usuarios;
      } else {
        console.error('A resposta não é um array:', usuarios);
      }
    }, error => {
      console.error('Erro ao obter os usuários:', error);
    });
  }
  toggleItem(usuario: { id: number, nome: string }): void {
    const isPreviouslySelected = this.isPreviouslySelected(usuario);

    if (isPreviouslySelected) {
      // Se o usuário está previamente selecionado, ele pode ser removido
      this.selectedLabels = this.selectedLabels.filter(item => item.id !== usuario.id);
    } else {
      // Caso contrário, adiciona o usuário à lista de selecionados
      this.selectedLabels.push({ id: usuario.id, nome: usuario.nome });
    }
  }

  isPreviouslySelected(usuario: { id: number, nome: string }): boolean {
    return this.selectedLabels.some(item => item.id === usuario.id);
  }
  getSelectedNames(): string {
    return this.selectedLabels.map(item => item.nome).join(', ');
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  // Função para verificar se o usuário está na lista de selecionados
  isSelected(usuario: { id: number, nome: string }): boolean {
    return this.selectedLabels.some(item => item.id === usuario.id);
  }

  carregaInfoEvento(id: number) {
    this.usuarioService.ListarUsuariosPorEvento(id).subscribe(
      (data) => {
        this.evento = data.item1;
        this.usuariosEditar = data.item2;

        this.eventoForm.patchValue({
          titulo: this.evento.titulo,
          data: new Date(this.evento.data).toISOString().split('T')[0],
          descricao: this.evento.descricao
        });
        this.selectedLabels = this.usuariosEditar.map((usuario: any) => ({
          id: usuario.id,
          nome: usuario.nome
        }));
      },
      (error) => {
        console.error('Erro ao carregar os dados', error);
      }
    );
  }

}
