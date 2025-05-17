import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletequizComponent } from './deletequiz.component';

describe('DeletequizComponent', () => {
  let component: DeletequizComponent;
  let fixture: ComponentFixture<DeletequizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletequizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletequizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
