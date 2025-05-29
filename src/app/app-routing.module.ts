import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { PacienteDetallesComponent } from './paciente-detalles/paciente-detalles.component';
import { PacienteCreateComponent } from './paciente-create/paciente-create.component';
import { ImageDetailComponent } from './image-detail/image-detail.component';
import { MedicoDetallesComponent } from './medico-detalles/medico-detalles.component';
import { InformeCreateComponent } from './informe-create/informe-create.component';

const routes: Routes = [
  { path: 'home', component:  HomeComponent},
  { path: '', component:  LoginComponent},
  { path: 'paciente/create', component: PacienteCreateComponent},
  { path: 'paciente/:id', component: PacienteDetallesComponent },
  { path: 'paciente/create/:id', component: PacienteCreateComponent},
  {path: 'image-detail/:id', component: ImageDetailComponent},
  {path: 'medico', component: MedicoDetallesComponent},
  { path: 'informe/create/:id', component: InformeCreateComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
