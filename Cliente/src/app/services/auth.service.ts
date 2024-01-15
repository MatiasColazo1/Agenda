import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ColoresService } from './colores.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 /*  private URL = 'https://back-agenda.onrender.com/api' */
  private URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router, private coloresService: ColoresService) { }

  getColorUser() {
    const token = this.getToken();
    return this.http.get<any>(this.URL + '/private', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateColorUser(color: string) {
    const token = this.getToken();
    return this.http.put<any>(this.URL + '/private', { colorUser: color }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


  signUp(user: User){
    return this.http.post<User>(this.URL + '/signup', user)
  }

  signIn(user: User){
    return this.http.post<any>(this.URL + '/signin', user)
  }

  loggedIn(): boolean{
    return !!localStorage.getItem('token')
  }

  getToken() {
    return localStorage.getItem('token')
  }

  logOut() {
    localStorage.removeItem('token')
    this.router.navigate(['/signin'])
  }
}

interface User {
  usuario: string;
  password: string;
}
