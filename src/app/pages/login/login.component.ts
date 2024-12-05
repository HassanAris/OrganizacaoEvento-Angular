import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UsuarioService } from './../../service/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [ Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.usuarioService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: response.message,
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.usuarioService.gerarToken(this.loginForm.value.email);
            this.router.navigate(['/home']);
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro no login!',
            text:  err.error,
            confirmButtonText: 'OK'
          });
        }
      });
    } else {

    }
  }


}

