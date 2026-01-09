import {  AfterViewChecked,Component,Input,inject, SimpleChanges,ElementRef,ViewChild } from '@angular/core';
import { DatePipe,CommonModule } from '@angular/common';
import { Mensaje } from '../../../core/models/mensaje';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-mensajes',
  imports: [DatePipe,CommonModule],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.css'
})
export class MensajesComponent implements  AfterViewChecked{
   @Input() mensajes: Mensaje[] = [];
public authService = inject(AuthService);

 
  @ViewChild('scrollContainer')
  private scrollContainer!: ElementRef<HTMLDivElement>;

  private lastLength = 0;

  ngAfterViewChecked(): void {
    if (this.mensajes.length !== this.lastLength) {
      this.scrollToBottom();
      this.lastLength = this.mensajes.length;
    }
  }

  private scrollToBottom(): void {
    const el = this.scrollContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}