import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColoresService {
  private colorSource = new BehaviorSubject<string>('defaultColor');
  currentColor = this.colorSource.asObservable();
  


  constructor() { }

  cambiarColor(color: string) {
    this.colorSource.next(color);
  }
}
