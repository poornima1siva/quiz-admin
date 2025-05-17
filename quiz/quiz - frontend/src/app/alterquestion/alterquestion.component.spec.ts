import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterquestionComponent } from './alterquestion.component';

describe('AlterquestionComponent', () => {
  let component: AlterquestionComponent;
  let fixture: ComponentFixture<AlterquestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlterquestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlterquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
