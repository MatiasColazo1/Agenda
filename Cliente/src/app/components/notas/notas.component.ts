import { Component, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { ColoresService } from 'src/app/services/colores.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit, OnDestroy {
  color: string = '';

  private subscription: Subscription = new Subscription();
  @ViewChild('textareaElement') textareaElement!: ElementRef;

  constructor(private colorService: ColoresService, public darkModeService: DarkModeService) { }

  ngOnInit(): void {
    this.subscription = this.colorService.currentColor.subscribe(color => {
      this.color = color;
  })
}

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
  }
}

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


  download(): void {
    // Obtener el texto del textarea
    const textareaValue = this.textareaElement.nativeElement.value;

    // Crear un objeto Blob con el contenido del textarea
    const blob = new Blob([textareaValue], { type: 'text/plain' });

    // Crear un objeto URL para el Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un elemento 'a' para simular un enlace de descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notas.txt';

    // Agregar el elemento 'a' al cuerpo del documento
    document.body.appendChild(a);

    // Simular un clic en el enlace para iniciar la descarga
    a.click();

    // Limpiar y liberar recursos
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  }

