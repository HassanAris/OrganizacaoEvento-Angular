import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criar-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './criar-usuario.component.html',
  styleUrls: ['./criar-usuario.component.scss']
})
export class CriarUsuarioComponent implements OnInit {
  criarUsuarioForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService) {
    this.criarUsuarioForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup): void {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.criarUsuarioForm.valid) {
      this.usuarioService.createUsuario(this.criarUsuarioForm.value.email, this.criarUsuarioForm.value.password, this.criarUsuarioForm.value.username).subscribe({
        next: (response) => {
          console.log(response)
          Swal.fire({
            icon: 'success',
            title: 'Usuario criado com sucesso!',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.router.navigate(['/login']);
          });

        },
        error: (err) => {
          console.log(err)
          Swal.fire({
            icon: 'error',
            title: 'Erro no cadastro!',
            text: err.error,
            confirmButtonText: 'OK'
          });
        }
      });
    } else {

    }
  }
}
