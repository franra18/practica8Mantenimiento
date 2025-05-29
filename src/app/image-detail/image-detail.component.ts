import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../services/image.service';
import { InformeService } from '../services/informe.service';
import { Imagen } from '../imagen';
import { Informe } from '../informe';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements OnInit {
  image: Imagen | any = new Imagen();
  //predictedData: Informe = new Informe();
  prediction: String = '';
  informe: Informe | any = null;
  userInput: string = '';
  isInforme: boolean = false;
  predicted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
    private informeService: InformeService
  ) { }

  ngOnInit(): void {
    const imageId = this.route.snapshot.paramMap.get('id');
    if (imageId) {
      this.fetchImage(+imageId);
    }
  }

  fetchImage(id: number): void {
    this.imageService.getImageInfo(id).subscribe({
      next: (image) => {
        this.image = image;
        this.image.path = `${environment.baseUrl}/imagen/${this.image.id}`
        console.log("elements ",this.image );
        this.hasInforme();

      },
      error: (error) => {
        console.error('Error fetching image:', error);
      }
    });
  }

  hasInforme(): void {
    this.informeService.getInformeImagen(this.image.id).subscribe({
      next: (informe) => {
        if (informe.length == 0) {
          this.isInforme = false;
        }else {
          this.isInforme = true;
          this.informe = informe[0];
          console.log("informe ",this.informe );
        }
      },
      error: (error) => {
        this.isInforme = false;
        console.error('Error fetching informe:', this.image.id);
      }
    });
  }

  predict(): void {
    //this.predictedData = Math.random().toString();
    /*this.informeService.updateInforme(this.informe).subscribe({
      next: (updatedInforme) => {
        console.log('Informe updated successfully', updatedInforme);
  
        this.informeService.getInforme(this.informe.id).subscribe({
          next: (fetchedInforme) => {
            console.log(fetchedInforme)
            //this.predictedData = fetchedInforme as unknown as Informe;
          },
          error: (fetchError) => {
            console.error('Error fetching updated informe:', fetchError);
          }
        });
      },
      error: (updateError) => {
        console.error('Error updating informe:', updateError);
      }
    });*/
    
    this.imageService.imagePrediction(this.image.id).subscribe({
        next: (prediction) => {
          console.log('Informe prediction correctly', prediction);
          this.prediction = prediction.score;
          this.predicted = true;
        },
        error: (updateError) => {
          console.error('Error updating informe:', updateError);
        }
    })
  }


}
