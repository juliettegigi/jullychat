import { Component,Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Mensaje } from '../../../core/models/mensaje';

@Component({
  selector: 'app-mensajes',
  imports: [DatePipe],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.css'
})
export class MensajesComponent {
   @Input() mensajes: Mensaje[] = [];

}
