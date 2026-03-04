import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-message-modal',
  imports: [],
  templateUrl: './message-modal.html',
  styleUrl: './message-modal.css',
})
export class MessageModal {

  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttonText: string = 'Fechar';

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

}
