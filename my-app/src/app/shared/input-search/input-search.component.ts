import { Component,inject ,Output,EventEmitter, Input} from '@angular/core';
import { FormsModule } from '@angular/forms';// para poder usar ngModel en la vista
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SocketService } from '../../core/services/socket.service';

@Component({
  selector: 'app-input-search',
    standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.css'
})
export class InputSearchComponent {
 private socketService = inject(SocketService);
 terminoBusqueda = '';
 @Output() resultados = new EventEmitter<any>();
 @Input() funcion?: (termino: string) => void;
  
 
 buscar() {
  if (this.funcion) {
    this.funcion(this.terminoBusqueda);
  }
}
}
