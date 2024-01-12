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
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router, public darkModeService: DarkModeService, private toastrService: ToastrService, private errorService: ErrorService) { }
  
  hide = true;
  
  ngOnInit(): void {

  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  signUp(form: NgForm) { 
    // Validar si los campos están vacíos
    if (this.cuenta.usuario === "" || this.cuenta.password === "") {
      this.toastrService.warning("Todos los campos son obligatorios", "Error");
      return;
    }
  
    // Validar la longitud del usuario y contraseña
    if (this.cuenta.usuario.length < 4 || this.cuenta.password.length < 4) {
      this.toastrService.warning("El usuario y la contraseña deben tener al menos 4 caracteres", "Error");
      return;
    }
  
    if (form.valid) {
      this.loading = true;
      this.authService.signUp(this.cuenta)
        .subscribe(
          (res: any) => {
            console.log(res);
            localStorage.setItem('token', res.token);
            this.toastrService.success('Cuenta creada exitosamente', 'Éxito');
            this.router.navigate(['/signin']);
            this.loading = false;
          }, (error: HttpErrorResponse) => {
            this.errorService.msjError(error);
            this.loading = false;
          }
        );
    }
  }

  togglePasswordVisibility(event: Event, form: NgForm) {
    event.preventDefault(); // Evitar la propagación del evento
    this.hide = !this.hide;
  }
}
