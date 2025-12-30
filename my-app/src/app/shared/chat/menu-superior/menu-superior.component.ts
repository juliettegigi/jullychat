import { Component,Input } from '@angular/core';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-menu-superior',
  imports: [],
  templateUrl: './menu-superior.component.html',
  styleUrl: './menu-superior.component.css'
})
export class MenuSuperiorComponent {
  @Input() contacto:User|null=null;
}
