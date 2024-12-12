import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CriarUsuarioComponent } from './pages/criar-usuario/criar-usuario.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { HomeComponent } from './pages/home/home.component';
import { GerenciamentoEventosComponent } from './pages/gerenciamento-eventos/gerenciamento-eventos.component';
import { AuthGuard } from './guards/auth.guard';
import { EditarEventoComponent } from './pages/visualizar-evento/visualizar-evento.component';
import { PessoasComponent } from './pages/pessoas/pessoas.component';
import { UserResolver } from './pages/user.resolver/user.resolver.component';
import { HistoricoComponent } from './pages/historico/historico.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'criar-usuario', component: CriarUsuarioComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], resolve: { user: UserResolver,}, },
  { path: 'gerenciamento-eventos', component: GerenciamentoEventosComponent , canActivate: [AuthGuard]},
  { path: 'visualizar-evento/:id', component: EditarEventoComponent },
  { path: 'pessoas', component: PessoasComponent, canActivate: [AuthGuard] },
  { path: 'historico', component: HistoricoComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

