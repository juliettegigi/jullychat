import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMisContactosComponent } from './lista-mis-contactos.component';

describe('ListaMisContactosComponent', () => {
  let component: ListaMisContactosComponent;
  let fixture: ComponentFixture<ListaMisContactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaMisContactosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaMisContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
