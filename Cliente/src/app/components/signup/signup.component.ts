import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  cuenta = {
    usuario: '',
    password: '',
  }

  constructor(private authService: AuthService, private router: Router, public darkModeService: DarkModeService, private toastrService: ToastrService, private errorService: ErrorService) { }
  
  hide = true;
  
  ngOnInit(): void {

  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  signUp(form: NgForm) { 
    if (this.cuenta.usuario == "" || this.cuenta.password == "") {
      this.toastrService.warning("Todos los campos son obligatorios", "Error")
      return;
    }

    if (form.valid) {
    this.authService.signUp(this.cuenta)
      .subscribe(
        (res: any) => {
          console.log(res)
          localStorage.setItem('token', res.token);
          this.toastrService.success('Cuenta creada exitosamente', 'Éxito');
          this.router.navigate(['/signin']);

        }, (error: HttpErrorResponse) => {
          this.errorService.msjError(error);
        }
      )
    }
  }

  togglePasswordVisibility(event: Event, form: NgForm) {
    event.preventDefault(); // Evitar la propagación del evento
    this.hide = !this.hide;
  }
}
