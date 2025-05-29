import { Component } from "@angular/core";
import { UsersService } from '../services/users.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  nombre: string = '';
  dni: string = '';

  constructor(private UserService: UsersService,
    private snackbar: MatSnackBar,
    private router: Router) {}

  login() {
    this.UserService.login(this.dni).subscribe({
      next: (data:any) => {
        this.router.navigateByUrl('/home');
          /*this.snackbar.open('Login exitoso', '', {
          duration: 1000
          });*/
      },
      error: (e: any) => {
        this.snackbar.open('Login no existoso', '', {
          duration: 1000
        });
      }
    });
  }
}


