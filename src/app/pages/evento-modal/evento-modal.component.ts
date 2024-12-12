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
  minDateTime: string = new Date().toISOString().slice(0, 16);

  ngOnInit() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`; // Formata para datetime-local

    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descricao: [''],
      data: [this.minDateTime, [Validators.required, this.validatePastDate()]],
      selectedLabels: [[]],
      id:['']
    });
    this.GetUsuarios();
    if (this.isEditMode && this.id) {
      this.carregaInfoEvento(this.id);
    }

    if (this.evento) {
      // Se houver um evento, preenche o formulário com os dados do evento
      this.isEditMode = true;
      this.eventoForm.patchValue({
        titulo: this.evento.titulo,
        data: this.evento.data.ToString("yyyy-MM-ddTHH:mm"),
        descricao: this.evento.descricao
      });
    }
  }

  validatePastDate() {
    return (control: any) => {
      const selectedDate = new Date(control.value);
      const now = new Date();
      return selectedDate < now ? { pastDate: true } : null;
    };
  }

  closeModal() {
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
      if(this.id != null){
        this.eventoForm.value.id = this.id
      }
      if (this.eventoForm.invalid) {
        this.eventoForm.markAllAsTouched(); // Marca todos os campos como 'tocados'
        return;
      }else{
        this.eventoService.criarEventoEditar(this.eventoForm,this.selectedLabels, this.isEditMode).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: this.isEditMode ? 'Evento Editado Com Sucesso' : 'Evento Criado Com Sucesso!',
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
            title: this.isEditMode ? 'Erro Ao Editar o Evento!' :'Erro Ao Criar o Evento!',
            text:  err.error,
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }

  carregarEventos(): void {
    this.eventoService.obterEventos().subscribe((eventos: Evento[]) => {
      this.eventos = eventos;
    });
  }

  GetUsuarios() {
    this.usuarioService.ListarUsuariosPorOrg().subscribe((usuarios: any) => {
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
          data: this.formatarData(this.evento.data),
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
  formatarData(data: Date): string {
    const date = new Date(data);

    // Pega os componentes da data (ano, mês, dia, hora, minuto)
    const ano = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');  // Adiciona 1 ao mês, pois o JavaScript começa em 0
    const dia = date.getDate().toString().padStart(2, '0');
    const hora = date.getHours().toString().padStart(2, '0');
    const minuto = date.getMinutes().toString().padStart(2, '0');

    // Formata a string no formato yyyy-MM-ddTHH:mm
    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
  }


}
