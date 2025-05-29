import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PacienteService } from '../services/paciente.service';
import { ImageService } from '../services/image.service';
import { Imagen } from '../imagen'; 
import {animate, state, style, transition, trigger} from '@angular/animations';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-paciente-detalles',
  templateUrl: './paciente-detalles.component.html',
  styleUrls: ['./paciente-detalles.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PacienteDetallesComponent implements OnInit {
  paciente: any; 
  images: Imagen[] = [];
  imageID: number = 0;
  url: string = environment.baseUrl + "/imagen/";
  displayedColumns: string[] = ['see', 'icon', 'date', 'deleteButton'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>(this.images);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement!: Imagen | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private imageService: ImageService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const pacienteId = this.route.snapshot.paramMap.get('id');

    if (pacienteId) {
      this.pacienteService.getAccount(+pacienteId).subscribe(paciente => {  
        this.paciente = paciente;
        this.fetchImages();
      });
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchImages(): void {
    this.imageService.getImagesByPacienteId(this.paciente.id).subscribe({
      next: (images: Imagen[]) => {
        this.images = images.map(image => {
          image.path = `${environment.baseUrl}/imagen/${image.id}`;
          return image;
        });
        this.images.sort((a, b) => {
          const idA = a.id || 0; // Si a.id es undefined o null, asigna 0
          const idB = b.id || 0; // Si b.id es undefined o null, asigna 0
          return idB - idA;
        });
        this.dataSource.data = this.images;
      },
      error: (error) => {
        console.error('Error fetching images:', error);
      }
    });
  }

  uploadImage(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      const json = JSON.stringify(this.paciente);
      const blob = new Blob([json], {
        type: 'application/json'
      });

      const formData = new FormData();
      formData.append('image', file, file.name);
      formData.append('paciente', blob);
  
      this.imageService.uploadImage(formData).subscribe({
        next: (response) => {
          // Assume response contains the new image data, including the ID
          const imageId = response.id;
          if (imageId) {
            // Wait for a few seconds before fetching the image data
            setTimeout(() => {
              this.fetchNewImage(imageId);
              this.fetchImages();
            }, 3000); // Delay of 3 seconds
          }
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.fetchImages();
        }
      });
    }
  }

  fetchNewImage(imageId: number): void {
    this.imageService.getImage(imageId).subscribe({
      next: (newImage) => {
        newImage.path = `${environment.baseUrl}/images/${newImage.path}`;
        this.images.push(newImage); // Add the fetched image to the array
      },
      error: (error) => {
        console.error('Error fetching new image:', error);
      }
    });
  }

  goToImage(imageId: number | undefined): void {
    this.router.navigate(['/image-detail', imageId]);
  }

  deleteImage(id: number){
    this.imageService.deleteImage(id).subscribe({
      next: () => {
        this.fetchImages();
      },
      error: (e: any) => {
        this.snackbar.open('Error deleting the paciente '+e.error, '', {
          duration: 3000
        });
      },
      complete: () => console.log('done'),
    });
  }

  confirmDeletion(event:Event, id: number) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'imagen ' + id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteImage(id);
      }
    });
  }
}