import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DarkModeService } from 'src/app/services/dark-mode.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  usuario = {
    user: '',
    password: '',
    confirmPassword: ''
  }

  constructor(private authService: AuthService, private router: Router, public darkModeService: DarkModeService) { }

  ngOnInit(): void {

  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  signUp() { /* ver mas tarde el confirm password no debe volver al inicio */
    if (this.usuario.password !== this.usuario.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }
    this.authService.signUp(this.usuario)
      .subscribe(
        (res: any) => {
          console.log(res)
          localStorage.setItem('token', res.token);
          this.router.navigate(['/signin']);
        },
        err => console.log(err)
      )
  }
}
