import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalInterviewComponent } from './technical-interview.component';

describe('TechnicalInterviewComponent', () => {
  let component: TechnicalInterviewComponent;
  let fixture: ComponentFixture<TechnicalInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalInterviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
