import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColoresService } from 'src/app/services/colores.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';



@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
})
export class CalendarioComponent implements OnInit, OnDestroy {
  selected: Date | null = null;
  color: string = '';

  private subscription: Subscription = new Subscription();
  constructor(private colorService: ColoresService, public darkModeService: DarkModeService) { }

  ngOnInit(): void {
    this.subscription = this.colorService.currentColor.subscribe(color => {
      this.color = color;
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
