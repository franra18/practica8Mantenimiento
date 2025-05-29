import { Component } from '@angular/core';
import { Paciente } from '../paciente';
import { PacienteService } from '../services/paciente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import {Location} from '@angular/common';
import { Medico } from '../medico';

@Component({
  selector: 'app-paciente-create',
  templateUrl: './paciente-create.component.html',
  styleUrl: './paciente-create.component.css'
})
export class PacienteCreateComponent {
  paciente: Paciente = new Paciente();
  create:boolean = true;
  pacienteID: number = 0;
  medico: Medico =new Medico();

  constructor(private pacienteService: PacienteService,
    private userService: UsersService,
    private snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location) { }

    ngOnInit(): void {
      if (this.route.snapshot.paramMap.has('id')){
        this.pacienteID = Number(this.route.snapshot.paramMap.get('id'));
        this.create=false;
      }

      this.medico = this.userService.getUser();

      if (!this.create){
        this.pacienteService.getAccount(this.pacienteID).subscribe({
          next: (data: any) => {
            this.paciente = <Paciente> data;
          },
          error: (e: any) => {
            this.snackbar.open('Error communicating with the server', '', {
              duration: 3000
            });
          }
        });
      }

  }

  back() {
    this._location.back();
  }

  onSubmit(paciente: Paciente) {
    if (this.create){
        this.paciente.medico = this.medico;
        this.pacienteService.createAccount(this.paciente).subscribe({
        next: (any) => {
          this.router.navigateByUrl('/home');
            /*this.snackbar.open('Paciente creado ', '', {
            duration: 1000
            });*/
        },
        error: (e: any) => {
          this.snackbar.open('Error creating the paciente: '+e.error, '', {
            duration: 1000
          });
        }
      });
    }else{
      this.pacienteService.updateAccount(this.paciente).subscribe({
        next: (any) => {
          this.router.navigateByUrl('/paciente/' + this.paciente.id);
            this.snackbar.open('Paciente updated ', '', {
            duration: 1000
            });
        },
        error: (e: any) => {
          this.snackbar.open('Error updating the cuenta: '+e.error, '', {
            duration: 1000
          });
        }
      });
    }
    
  }
}
