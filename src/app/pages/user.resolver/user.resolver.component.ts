import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { UsuarioService } from '../../service/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<any> {
  constructor(private usuarioService: UsuarioService) {}

  resolve() {
    return this.usuarioService.GetUsuarioLogado(); // Retorna o Observable ou Promise com os dados
  }
}
