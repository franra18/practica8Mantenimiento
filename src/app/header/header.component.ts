import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { Medico } from '../medico';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  login: boolean = this.UserService.isLogin();
  medico: Medico = new Medico();

  constructor(private UserService: UsersService,
    private route: Router) {}

  ngOnInit() {
    this.route.events.subscribe(() => {
      this.login = this.UserService.isLogin();
      this.medico = this.UserService.getUser();
    })
  }

  logout() {
    this.UserService.logout();
  }
}
