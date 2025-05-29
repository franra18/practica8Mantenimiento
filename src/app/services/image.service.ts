import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Imagen } from '../imagen'; 
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = environment.baseUrl;
  private url = this.baseUrl + '/imagen';

  constructor(private httpClient: HttpClient) {}

  uploadImage(formData: FormData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'multipart/form-data'})
    }
    return this.httpClient.post(this.baseUrl + '/imagen', formData);
  }

  imagePrediction(id: number): Observable<any> {
    return this.httpClient.get<string>(this.baseUrl + '/imagen/predict/' + id);
  }


  getImage(id: number): Observable<Imagen> {
    console.log(`${this.url}/${id}`);
    return this.httpClient.get<Imagen>(`${this.url}/${id}`);
  }

  addImage(imagen: Imagen): Observable<any> {
    console.log("Imagen detail_service: " , imagen)
    return this.httpClient.post(this.url, imagen, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }); }

  updateImage(imagen: Imagen): Observable<any> {
    return this.httpClient.put(this.url, imagen, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  deleteImage(id: number): Observable<any> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  getImagesByPacienteId(id: number): Observable<Imagen[]> {
    return this.httpClient.get<Imagen[]>(`${this.url}/paciente/${id}`);
  }


  predictImage(imageId: number): Observable<any> {
    // Replace with actual prediction API call or logic
    return this.httpClient.post(this.baseUrl + '/predict', { imageId: imageId });
  }

  getImageInfo(imageId: number): Observable<any> {
    return this.httpClient.get(this.baseUrl + '/imagen/info/' + imageId);
  }
}
