import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent {
  recuperarSenhaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.recuperarSenhaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.recuperarSenhaForm.valid) {
      // Lógica para recuperação de senha
      console.log('Recuperação de senha solicitada para:', this.recuperarSenhaForm.value.email);
    }
  }
}
