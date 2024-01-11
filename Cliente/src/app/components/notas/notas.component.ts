import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColoresService } from 'src/app/services/colores.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { NotasService } from 'src/app/services/notas.service';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit, OnDestroy {
  @Output() loaded = new EventEmitter<boolean>();
  color: string = '';
  notas: any[] = [];

  private subscription: Subscription = new Subscription();
  @ViewChild('textareaElement') textareaElement!: ElementRef;

  constructor(private colorService: ColoresService, public darkModeService: DarkModeService, private notasService: NotasService) { }

  ngOnInit(): void {
    this.getNota();
    this.subscription = this.colorService.currentColor.subscribe(color => {
      this.color = color;
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
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

  getNota() {
    this.loaded.emit(true); // Emitir evento al iniciar la carga
    this.notasService.getNota().subscribe(
      (data) => {
        this.notas = data.length > 0 ? data : [{ contenido: '' }];
        console.log('Nota obtenida: ', this.notas);
        this.loaded.emit(false); // Emitir evento al finalizar la carga
      }, (error) => {
        console.error('Error al obtener las notas: ', error);
        this.loaded.emit(false); // Emitir evento también en caso de error
      }
    );
  }
  
  save(): void {
    this.notas.forEach(nota => {
      if (nota._id) {
        // Actualizar nota existente
        this.notasService.putNota(nota._id, { contenido: nota.contenido }).subscribe(
          response => {
            console.log('Nota actualizada con éxito', response);
          },
          error => {
            console.error('Error al actualizar la nota', error);
          }
        );
      } else if (nota.contenido) {
        // Crear nueva nota
        this.notasService.postNota(nota.contenido).subscribe(
          response => {
            console.log('Nueva nota creada con éxito', response);
            // Actualiza el ID de la nota con el recibido del servidor
            nota._id = response._id;
          },
          error => {
            console.error('Error al crear la nota', error);
          }
        );
      }
    });
  }
}

