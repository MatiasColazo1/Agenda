import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  constructor(public authService: AuthService, public darkModeService: DarkModeService) { }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}
