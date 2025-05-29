import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Medico } from '../medico';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.baseUrl;
  user: Medico = new Medico();

  constructor(private httpClient: HttpClient,
    private snackbar: MatSnackBar) { }

    url = this.baseUrl + '/medico';
    islogin: boolean = false;
    
    login(dni: string){
      this.islogin = true;
      this.httpClient.get<Medico>(this.url + '/dni/' + dni).subscribe({
        next: (data: any) => {
          this.user = <Medico> data;
        }
      });
      return this.httpClient.get<Medico>(this.url + '/dni/' + dni);
    }

    logout(){
      this.islogin = false;
    }

    isLogin(){
      return this.islogin;
    }

    getUser(){
      return this.user;
    }

    getId(){
      return this.user.id;
    }
}
