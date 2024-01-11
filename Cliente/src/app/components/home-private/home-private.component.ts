import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-home-private',
  templateUrl: './home-private.component.html',
  styleUrls: ['./home-private.component.css']
})
export class HomePrivateComponent implements OnInit {
  loading: boolean = true;
  private componentsLoaded = 0;

  constructor(public darkModeService: DarkModeService) {}

  ngOnInit(): void {
    
  }

  onComponentLoaded(): void {
    this.componentsLoaded++;
    if (this.componentsLoaded === 1) { // Número total de componentes
      this.loading = false;
    }
  }
}
