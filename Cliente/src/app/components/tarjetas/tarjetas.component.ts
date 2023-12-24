import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { TarjetasService } from 'src/app/services/tarjetas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ColoresService } from 'src/app/services/colores.service';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.css']
})
export class TarjetasComponent implements OnInit, OnDestroy {
  color: string = '';
  
  private subscription: Subscription = new Subscription();
  public modalDelete: boolean = false;
  public modalEdit: boolean = false;
  private deleteId!: string;

  @ViewChild('modal', { static: true }) modalAbrir!: ElementRef
  tarjetas: any[] = [];
  nuevaTarjeta: any = {
    titulo: '',
    descripcion: ''
  }
  tarjetaActiva: any = null;
  formGroup: FormGroup

  constructor(private tarjetasService: TarjetasService, public darkModeService: DarkModeService, private modalService: NgbModal, private fb: FormBuilder, private colorService: ColoresService) {
    this.formGroup = this.fb.group({
      id: [''],
      titulo: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.getTarjetas()
    this.subscription = this.colorService.currentColor.subscribe(color => {
      this.color = color;
    })
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }
  //-------------------- TRAER TARJETAS--------------- // 
  getTarjetas() {
    this.tarjetasService.getTarjeta().subscribe((data: any) => {
      this.tarjetas = data.map((tarjeta: any) => ({ ...tarjeta, expandida: false }));
    })
  }

  //-------------------- CREAR TARJETAS--------------- // 
  postTarjeta() {
    this.tarjetasService.postTarjeta(this.nuevaTarjeta).subscribe(
      (data: any) => {
        console.log('Tarjeta agregada con exito: ', data);
        this.getTarjetas();
        this.nuevaTarjeta = {}
      },
      (error) => {
        console.error('Error al agregar tarjeta: ', error);
      }
    )
  }

  //-------------------- ELIMINAR TARJETAS--------------- // 
  delete(tarjeta: any) {
    this.modalDelete = true;
    this.deleteId = tarjeta._id;
  }

  eliminarTarjeta() {
    this.tarjetasService.deleteTarjeta(this.deleteId).subscribe(data => {
      this.getTarjetas();
    })

  }

  //-------------------- EDITAR TARJETAS--------------- // 
  edit(tarjeta: any) {
    this.modalEdit = true;
    this.formGroup.patchValue({
      id: tarjeta._id,
      titulo: tarjeta.titulo,
      descripcion: tarjeta.descripcion
    });
    this.getTarjetas();
  }

  editarTarjeta() {
    const tarjetaEditada = { ...this.formGroup.value };

    this.tarjetasService.putTarjeta(tarjetaEditada.id, tarjetaEditada).subscribe(
      (tarjetaActualizada: any) => {
        console.log('Tarjeta actualizada con éxito: ', tarjetaActualizada);
        this.getTarjetas();
        this.modalService.dismissAll(); // Cierra el modal después de la edición
      },
      (error) => {
        console.error('Error al actualizar tarjeta: ', error);
      }
    );
  }



  activarModoArrastrar(tarjeta: any) {
    this.tarjetaActiva = tarjeta;
  }

  toggleTarjeta(tarjeta: any) {
    // Cambiar el estado expandido al hacer clic en la tarjeta
    if (this.tarjetaActiva !== tarjeta) {
      // Cambiar el estado expandido solo si la tarjeta no está en modo de arrastrar
      tarjeta.expandida = !tarjeta.expandida;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tarjetas, event.previousIndex, event.currentIndex);
  }



}
