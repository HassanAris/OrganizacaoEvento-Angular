import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CriarUsuarioComponent } from './pages/criar-usuario/criar-usuario.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { HomeComponent } from './pages/home/home.component';
import { GerenciamentoEventosComponent } from './pages/gerenciamento-eventos/gerenciamento-eventos.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redireciona para 'login' apenas quando não estiver já na rota
  { path: 'login', component: LoginComponent },
  { path: 'criar-usuario', component: CriarUsuarioComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'gerenciamento-eventos', component: GerenciamentoEventosComponent },
  // Rota wildcard para capturar qualquer rota inválida e redirecionar para a página de login (ou uma página 404)
  { path: '**', redirectTo: '/login' }
];

