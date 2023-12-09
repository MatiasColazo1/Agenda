import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  usuario = {
    user: '',
    password: '',
  }

  constructor(private authService: AuthService, private router: Router, public darkModeService: DarkModeService, private toastrService: ToastrService, private errorService: ErrorService) { }

  ngOnInit(): void {

  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  signUp() { /* ver mas tarde el confirm password no debe volver al inicio */
    if (this.usuario.user == "" || this.usuario.password == "") {
      this.toastrService.error("Todos los campos son obligatorios", "Error")
      return;
    }
    this.authService.signUp(this.usuario)
      .subscribe(
        (res: any) => {
          console.log(res)
          localStorage.setItem('token', res.token);
          this.router.navigate(['/signin']);

        }, (error: HttpErrorResponse) => {
          this.errorService.msjError(error);
        }
      )
  }
}
