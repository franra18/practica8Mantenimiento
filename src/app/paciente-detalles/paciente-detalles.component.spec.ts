import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteDetallesComponent } from './paciente-detalles.component';

describe('PacienteDetallesComponent', () => {
  let component: PacienteDetallesComponent;
  let fixture: ComponentFixture<PacienteDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PacienteDetallesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacienteDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
