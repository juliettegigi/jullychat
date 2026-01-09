import { Component , Input, Output,inject} from '@angular/core';


@Component({
  selector: 'app-lista-usuarios',
  standalone:true,
  imports: [],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent {
  //recibo los resultados del componente padre
  @Input() resultados : any[] = [];
  // recibo la funcion del botón agregar
  @Input() btn ?: (elem:any)=>void;
  // recibo la funcion cuando le hacen click a un li
  @Input() clickLi ?:(elem:any)=>void;
  @Input() listTitle :string="";
}
