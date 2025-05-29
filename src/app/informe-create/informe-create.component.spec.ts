import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeCreateComponent } from './informe-create.component';

describe('InformeCreateComponent', () => {
  let component: InformeCreateComponent;
  let fixture: ComponentFixture<InformeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformeCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
