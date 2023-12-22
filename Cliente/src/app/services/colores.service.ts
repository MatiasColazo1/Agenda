import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColoresService {
  private colorSource = new BehaviorSubject<string>('default');
  currentColor = this.colorSource.asObservable();
  
  private backgroundColorSource = new BehaviorSubject<string>('defaultBackground');
  currentBackgroundColor = this.backgroundColorSource.asObservable();

  constructor() { }

  cambiarColor(color: string) {
    this.colorSource.next(color);
    this.backgroundColorSource.next(color + 'Background'); // 'rosaBackground', 'verdeBackground', etc.
  }
}
