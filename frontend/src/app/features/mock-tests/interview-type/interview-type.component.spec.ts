import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewTypeComponent } from './interview-type.component';

describe('InterviewTypeComponent', () => {
  let component: InterviewTypeComponent;
  let fixture: ComponentFixture<InterviewTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
