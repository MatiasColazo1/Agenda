import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomePrivateComponent } from './components/home-private/home-private.component';
import { AuthGuard } from './auth.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './components/nav/nav.component';
import { TarjetasComponent } from './components/tarjetas/tarjetas.component';
import { NotasComponent } from './components/notas/notas.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { TareasComponent } from './components/tareas/tareas.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CalendarioPrivateComponent } from './components/calendario-private/calendario-private.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';



registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HomePrivateComponent,
    FooterComponent,
    NavComponent,
    TarjetasComponent,
    NotasComponent,
    TareasComponent,
    CalendarioPrivateComponent,
    CalendarioComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,

    MatCardModule,
    NzCalendarModule,
    ToastrModule.forRoot({
      timeOut:4000,
      positionClass:"toast-top-right",
      preventDuplicates:true,
    }),
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
