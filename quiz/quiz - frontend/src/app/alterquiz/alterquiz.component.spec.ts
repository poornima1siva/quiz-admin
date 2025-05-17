import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterquizComponent } from './alterquiz.component';

describe('AlterquizComponent', () => {
  let component: AlterquizComponent;
  let fixture: ComponentFixture<AlterquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlterquizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlterquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
