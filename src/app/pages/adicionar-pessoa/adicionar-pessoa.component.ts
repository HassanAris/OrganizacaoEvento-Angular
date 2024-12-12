import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-adicionar-pessoa',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './adicionar-pessoa.component.html',
  styleUrl: './adicionar-pessoa.component.scss'
})
export class AdicionarPessoaComponent {

  showModal: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() usuarioCreated = new EventEmitter<any>();
  userForm!: FormGroup;
  isModalOpen = false;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService){}

  ngOnInit() {
    this.userForm = this.fb.group({
        nome: [''],
        email: [''],
    });
  }
  onSubmit(){
    this.usuarioService.atualizarInstituicao(this.userForm.value.nome, this.userForm.value.email)
    .subscribe({
      next: (response) => {
        this.usuarioCreated.emit();
        this.onClose();
      },
      error: (error) => {
      }
    });
  }

  closeModal() {
    this.showModal = false;
  }

  onClose() {
    this.close.emit();
  }

}
