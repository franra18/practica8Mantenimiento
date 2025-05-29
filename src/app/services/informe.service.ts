import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Informe } from '../informe';



@Injectable({
  providedIn: 'root'
})
export class InformeService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

    url = this.baseUrl + '/informe';

    getInforme(id: number){
      return this.httpClient.get<JSON>(this.url + '/' + id);
    }
    
    createInforme(data: Informe){
      console.log("elem ",data );

      return this.httpClient.post(this.url, data)
    }

    updateInforme(data: Informe){
      return this.httpClient.put(this.url, data)
    }

    deleteInforme(id: number){
      return this.httpClient.delete(this.url + '/' + id)
    }

    getInformeImagen(id: number){
      return this.httpClient.get<JSON[]>(this.url + '/imagen/' + id);
    }
}
