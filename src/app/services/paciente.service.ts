import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Paciente } from '../paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

    url = this.baseUrl + '/paciente';
    
    getAccounts(){
      return this.httpClient.get<JSON[]>(this.url);
    }

    getAccount(id: number){
      return this.httpClient.get<JSON>(this.url + '/' + id);
    }
    
    createAccount(data: Paciente){
      return this.httpClient.post(this.url, data)
    }

    updateAccount(data: Paciente){
      return this.httpClient.put(this.url, data)
    }

    deleteAccount(id: number){
      return this.httpClient.delete(this.url + '/' + id)
    }

    getPacienteMedico(id: number){
      return this.httpClient.get<JSON[]>(this.url + '/medico/' + id);
    }
}
