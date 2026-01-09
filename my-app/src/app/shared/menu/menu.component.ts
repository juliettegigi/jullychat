import { Component ,inject} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
public AuthService = inject(AuthService);
}
