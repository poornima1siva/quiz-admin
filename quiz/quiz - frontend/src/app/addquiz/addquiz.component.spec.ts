import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddquizComponent } from './addquiz.component';

describe('AddquizComponent', () => {
  let component: AddquizComponent;
  let fixture: ComponentFixture<AddquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddquizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
