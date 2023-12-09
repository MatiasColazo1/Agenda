import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

  usuario = {
    user: '',
    password: ''
  }

  constructor(private authService: AuthService, private router: Router, public darkModeService: DarkModeService) { }

  ngOnInit() {
  
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }


  signIn() {
    this.authService.signIn(this.usuario)
      .subscribe(
        res => {
          console.log(res)
          localStorage.setItem('token', res.token)
          this.router.navigate(['/private']);
        },
        err => console.log(err)
      )
  }
}
