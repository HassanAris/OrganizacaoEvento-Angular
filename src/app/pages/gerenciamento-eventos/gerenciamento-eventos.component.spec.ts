import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciamentoEventosComponent } from './gerenciamento-eventos.component';

describe('GerenciamentoEventosComponent', () => {
  let component: GerenciamentoEventosComponent;
  let fixture: ComponentFixture<GerenciamentoEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciamentoEventosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciamentoEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
