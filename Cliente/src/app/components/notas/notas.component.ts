import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent {
  @ViewChild('textareaElement') textareaElement!: ElementRef;

  

  copy() {
    // Obtener el texto del textarea
    const textareaValue = this.textareaElement.nativeElement.value;
  
    // Copiar al portapapeles
    const el = document.createElement('textarea');
    el.value = textareaValue;
    document.body.appendChild(el);
    
    // Esperar a que Angular actualice la vista
    setTimeout(() => {
      // Seleccionar todo el texto del textarea después de un pequeño retraso
      this.textareaElement.nativeElement.select();
      document.execCommand('copy');
      document.body.removeChild(el);
  
      // Puedes mostrar un mensaje de éxito o realizar otras acciones después de copiar.
      console.log('Texto copiado al portapapeles:', textareaValue);
    });
}
}