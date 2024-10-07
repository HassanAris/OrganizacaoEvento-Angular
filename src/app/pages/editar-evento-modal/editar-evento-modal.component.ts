import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-evento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-evento-modal.component.html',
  styleUrls: ['./editar-evento-modal.component.scss']
})
export class EditarEventoModalComponent {
  @Input() event: any;
  @Output() eventUpdated = new EventEmitter<any>();

  onSubmit() {
    this.eventUpdated.emit(this.event);
  }
}
