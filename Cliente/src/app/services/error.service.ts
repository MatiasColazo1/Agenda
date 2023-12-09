import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor( private toastrService: ToastrService) { }
    
    msjError(e: HttpErrorResponse){
    if(e.error.msg){
      this.toastrService.error(e.error.msg, "error");
    } else {
      this.toastrService.error("Upps ocurrio un error", "error");
    }
  }
}
