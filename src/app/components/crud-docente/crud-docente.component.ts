import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Docente } from 'src/app/models/docente.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { DocenteService } from 'src/app/services/docente.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crud-docente',
  templateUrl: './crud-docente.component.html',
  styleUrls: ['./crud-docente.component.css']
})
export class CrudDocenteComponent implements OnInit {

  //Para la Grilla
   filtro: string ="";
 
   //Para el ubigeo
   departamentos: string[] = [];;
   provincias: string[] = [];;
   distritos: Ubigeo[] = [];;

   
   //Grila
  dataSource:any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns = ["idDocente","nombre","dni","fecha","hora","ubigeo","estado",'actions'];

  constructor(private formBuilder: FormBuilder,  
              private dialogService: MatDialog,
              private docenteService:DocenteService, 
              private ubigeoService:UbigeoService) {
      this.ubigeoService.listarDepartamento().subscribe(
          response => this.departamentos = response
      );            
  }

  
  openAddDialog() {
    console.log(">>> openAddDialog  >>");
    /*const dialogRef = this.dialogService.open(CrudDocenteAddComponent);
    dialogRef.afterClosed().subscribe(result => {
        console.log(">>> result >> " + result);
        if (result === 1) {
            this.refreshTable();
        }
    });*/
  }

 ngOnInit(): void {}

 consultaDocente(){
      console.log(">>> consultaDocente >>> " +  this.filtro);
      this.refreshTable();
 }



  elimina(obj:Docente){
          Swal.fire({
            title: '¿Desea eliminar?',
            text: "Los cambios no se van a revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, elimina',
            cancelButtonText: 'No, cancelar'
          }).then((result) => {
                if (result.isConfirmed) {
                    this.docenteService.elimina(obj.idDocente || 0).subscribe(
                          x => {
                                this.refreshTable();
                                Swal.fire('Mensaje', x.mensaje, 'info');
                          }
                    );
                }
          })   
   }

   actualizaEstado(obj:Docente){
      obj.estado = obj.estado == 1? 0 : 1;  
      this.docenteService.actualiza(obj).subscribe();
   }

   openUpdateDialog(obj:Docente) {
    console.log(">>> openUpdateDialog  >> 111");
    console.log(">>> idDocente >> " + obj.idDocente);
    console.log(">>> nombre >>  " + obj.nombre);
    console.log(">>> dni >>  " + obj.dni);
    console.log(">>> estado >>  " + obj.estado);
    console.log(">>> idUbigeo >>  " + obj.ubigeo?.idUbigeo);
    console.log(">>> departamento >>  " + obj.ubigeo?.departamento);
    console.log(">>> provincia >>  " + obj.ubigeo?.provincia);
    console.log(">>> distrito >>  " + obj.ubigeo?.distrito);


    /*const dialogRef = this.dialogService.open(CrudDocenteUpdateComponent, {data:obj});

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
            this.refreshTable();
      }
    });*/
   
}


private refreshTable() {
  this.docenteService.consultaPorNombre(this.filtro==""?"todos":this.filtro).subscribe(
    x => {
      this.dataSource = new MatTableDataSource<Docente>(x);
      this.dataSource.paginator = this.paginator; 
    }
  );
}
}