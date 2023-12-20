import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { TareasService } from 'src/app/services/tareas.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';


@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
})
export class TareasComponent implements OnInit {
  nuevaTarea: any = {
    titulo: '',
  };
  tareas: any[] = [];
  deleteId!: string;
  passwordVisible: boolean = false;
  formGroup: FormGroup;
  tareaEditando: any = null;
  colores: string[] = ['rojo', 'naranja', 'amarillo', 'verde', 'celeste', 'azul', 'violeta'];

  constructor(
    private tareasService: TareasService,
    public darkModeService: DarkModeService,
    private fb: FormBuilder,
    private errorService: ErrorService
  ) {
    this.formGroup = this.fb.group({
      id: [''],
      titulo: ['', [Validators.required, this.noWhitespaceValidator]],
      
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    this.getTareas();
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // ----------------------- TRAER TAREAS ----------------- //
  getTareas() {
    this.tareasService.getTarea().subscribe((data: any) => {
      this.tareas = data.map((tarea: any, index: number) => ({
        ...tarea,
        color: this.colores[index % this.colores.length],
      }));
    });
  }


  // ----------------------- CREAR TAREAS ----------------- //
  postTareas() {
    // Asigna un valor predeterminado al título antes de crear la nueva tarea
    this.nuevaTarea.titulo = 'Nueva Tarea';
  
    this.tareasService.postTarea(this.nuevaTarea).subscribe((data: any) => {
      this.getTareas();
      this.nuevaTarea = {}; // Restablecer el input después de crear
    });
  }

  // ----------------------- BORRAR TAREAS ----------------- //

  deleteTarea(tarea: any) {
    this.deleteId = tarea._id;
    this.tareasService.deleteTarea(this.deleteId).subscribe((data) => {
      this.getTareas();
      this.nuevaTarea = {}; // Restablecer el input después de borrar
    });
  }

  editarTarea(tarea: any) {
    // Al editar, establece el valor del formulario para los controles 'id' y 'titulo'
    if (tarea && tarea.titulo !== undefined) {
    this.formGroup.setValue({
      id: tarea._id,
      titulo: tarea.titulo
      // Otros controles si es necesario
    });
    this.tareaEditando = tarea;
  }

}

  cancelarEdicion() {
    this.tareaEditando = null;
    this.formGroup.reset();
  }

  actualizarTarea() {
    if (this.formGroup.valid) {
        const tareaActualizada = {
            id: this.formGroup.get('id')?.value,
            titulo: this.formGroup.get('titulo')?.value,
            completada: this.tareaEditando ? this.tareaEditando.completada : false,
        };

        this.tareasService.putTarea(tareaActualizada.id, tareaActualizada).subscribe(data => {
            this.getTareas();
            this.tareaEditando = null;
            this.formGroup.reset();
        });
    }
}

toggleCompletada(tarea: any) {
  tarea.completada = !tarea.completada;

  // Realiza la actualización directa de la tarea
  this.tareasService.putTarea(tarea._id, tarea).subscribe(() => {
    // Actualiza la lista de tareas después de la actualización
    this.getTareas();
  });
}
  }

