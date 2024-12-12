import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { UsuarioService } from '../../service/usuario.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualizar-evento',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './visualizar-evento.component.html',
  styleUrls: ['./visualizar-evento.component.scss']
})
export class EditarEventoComponent implements OnInit {
  evento: any;
  usuarios: any[] = [];
  origemTela?: string; // Definido como opcional

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {

    // Pegando o query param 'from' diretamente
    this.activatedRoute.queryParams.subscribe(params => {
      this.origemTela = params['from'];
      console.log('Origem da tela:', this.origemTela);
    });


    // Obtendo o ID do evento da URL e carregando os dados
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.usuarioService.ListarUsuariosPorEvento(id).subscribe(
      (data) => {
        this.evento = data.item1;
        this.usuarios = data.item2;
      },
      (error) => {
        console.error('Erro ao carregar os dados', error);
      }
    );


  }

  voltarPagina() {
    if (this.origemTela === 'home') {
      this.router.navigate(['/home']);
    } else if (this.origemTela === 'historico') {
      this.router.navigate(['/historico']);
    } else if (this.origemTela === 'gerenciamento-eventos') {
      this.router.navigate(['/gerenciamento-eventos']);
    }
  }
}
