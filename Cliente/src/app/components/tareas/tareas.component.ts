import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { TareasService } from 'src/app/services/tareas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private tareasService: TareasService,
    public darkModeService: DarkModeService,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      id: [''],
      titulo: ['', Validators.required],
    });
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
      this.tareas = data;
    });
  }

  // ----------------------- CREAR TAREAS ----------------- //
  postTareas() {
    this.tareasService.postTarea(this.nuevaTarea).subscribe((data: any) => {
      this.getTareas();
      this.nuevaTarea = {};
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
    this.tareaEditando = tarea;
    this.formGroup.setValue({
      id: tarea._id,
      titulo: tarea.titulo
    });
  }
  
  cancelarEdicion() {
    this.tareaEditando = null;
    this.formGroup.reset();
  }

  actualizarTarea() {
    const tareaActualizada = this.formGroup.value;
    this.tareasService.putTarea(tareaActualizada.id, tareaActualizada).subscribe(data => {
      this.getTareas();
      this.tareaEditando = null;
      this.formGroup.reset();
    });
  }
}
