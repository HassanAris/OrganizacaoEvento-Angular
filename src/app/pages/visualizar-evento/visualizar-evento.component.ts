
import { UsuarioService } from '../../service/usuario.service';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualizar-evento',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './visualizar-evento.component.html',
  styleUrl: './visualizar-evento.component.scss'
})
export class EditarEventoComponent {
  constructor(private usuarioService: UsuarioService, private router: Router,  private activatedRoute: ActivatedRoute) {}

  evento: any;
  usuarios: any[] = [];

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.usuarioService.ListarUsuariosPorEvento(id).subscribe(
      (data) => {
        console.log(data)
        this.evento = data.item1;
        this.usuarios = data.item2;
      },
      (error) => {
        console.error('Erro ao carregar os dados', error);
      }
    );
  }

  voltarPagina(){
    this.router.navigate(['/home']);
  }

}
