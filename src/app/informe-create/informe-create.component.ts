import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InformeService } from '../services/informe.service';
import { Informe } from '../informe';
import { environment } from '../../environments/environment.development';
import { ImageService } from '../services/image.service';
import { Imagen } from '../imagen';


@Component({
  selector: 'app-informe-create',
  templateUrl: './informe-create.component.html',
  styleUrls: ['./informe-create.component.css']
})
export class InformeCreateComponent implements OnInit {
  informe: Informe | any = new Informe();
  image: Imagen | any = new Imagen();
  imageId: number = 0;
  prediction: String = '';
  predicted: boolean = false;
  informeText: string = '';

  constructor(
    private route: ActivatedRoute,
    private informeService: InformeService,
    private router: Router,
    private imageService: ImageService,

  ) { }

  ngOnInit(): void {
    // Obtener el ID de la imagen de los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      this.imageId = Number(params.get('id'));
      this.fetchImage(this.imageId);
    });
  }

  predict() {
    // Generar un número aleatorio para la predicción y marcar como predecido
   //this.prediction = Math.random();
    this.predicted = true;
    this.imageService.imagePrediction(this.image.id).subscribe({
        next: (prediction) => {
          console.log('Informe prediction correctly', prediction);
          this.prediction = prediction.prediction;
        },
        error: (updateError) => {
          console.error('Error updating informe:', updateError);
        }
    })
  }

  fetchImage(id: number): void {
    this.imageService.getImageInfo(id).subscribe({
      next: (image) => {
        this.image = image;

      },
      error: (error) => {
        console.error('Error fetching image:', error);
      }
    });
  }

  saveInforme() {
    this.informe = new Informe();
    this.informe.prediccion = this.prediction? this.prediction.toString() : '';
    this.informe.contenido = this.informeText;
    this.informe.imagen = this.image;



    // Guardar el informe usando el servicio
    this.informeService.createInforme(this.informe).subscribe({
      next: () => {
        // Redireccionar al usuario a la página de detalles de la imagen
        this.router.navigate(['/image-detail', this.imageId]);
      },
      error: (error) => {
        console.error('Error al guardar el informe:', error);
      }
    });
  }
}
