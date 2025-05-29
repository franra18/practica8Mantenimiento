import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoDetallesComponent } from './medico-detalles.component';

describe('MedicoDetallesComponent', () => {
  let component: MedicoDetallesComponent;
  let fixture: ComponentFixture<MedicoDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicoDetallesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicoDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
