import { Component } from '@angular/core';
import { Medico } from '../medico';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-medico-detalles',
  templateUrl: './medico-detalles.component.html',
  styleUrl: './medico-detalles.component.css'
})
export class MedicoDetallesComponent {
  medico: Medico = new Medico();

  constructor(private userService: UsersService) { }
  
  ngOnInit(): void { 
    this.medico = this.userService.getUser();
  }
}
