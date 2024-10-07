import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Certifique-se de que as rotas estão importadas corretamente
import {  provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UsuarioService } from './app/service/usuario.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Fornecer as rotas corretamente aqui
    provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync()
  ],
}).catch((err) => console.error(err));
