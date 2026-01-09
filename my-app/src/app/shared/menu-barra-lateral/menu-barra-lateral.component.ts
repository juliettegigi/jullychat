import { Component, EventEmitter, Output,Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-menu-barra-lateral',
    imports: [MatButtonModule],
  standalone: true,
  templateUrl: './menu-barra-lateral.component.html',
  styleUrl: './menu-barra-lateral.component.css'
})
export class MenuBarraLateralComponent {
  // @Output() agregarPersonaClick = new EventEmitter<void>();
  // @Output() clickNuevoMsg = new EventEmitter<void>();
   @Input() currentBtnMenu:string="default"
   @Input() clickNuevoMsg!: ()=>void;
   @Input() clickAddContact!: ()=>void;
   addContact() {
    // this.agregarPersonaClick.emit();
     this.clickAddContact();
  }
  nuevoChat() {
    // this.clickNuevoMsg.emit();
     this.clickNuevoMsg();
  }
}
