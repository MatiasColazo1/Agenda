import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-home-private',
  templateUrl: './home-private.component.html',
  styleUrls: ['./home-private.component.css']
})
export class HomePrivateComponent implements OnInit {

  constructor(public darkModeService: DarkModeService) {}

  ngOnInit(): void {
    
  }

}
