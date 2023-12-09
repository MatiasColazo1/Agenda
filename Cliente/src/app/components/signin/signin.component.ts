import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { FormGroup, Validator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

  cuenta = {
    usuario: '',
    password: ''
  }

  constructor(private authService: AuthService, private router: Router, public darkModeService: DarkModeService, private toastrService: ToastrService) { }

  ngOnInit() {
  
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }


 signIn() {
    this.authService.signIn(this.cuenta)
      .subscribe(
        res => {
          console.log(res)
          localStorage.setItem('token', res.token);
          this.toastrService.success('Ingreso con exito', 'Bienvenido')
          this.router.navigate(['/private']);
        },
        err => {
          console.log(err);
          this.toastrService.error('El usuario no existe!', 'Error de autenticación');
        }
      )
  } 
}
