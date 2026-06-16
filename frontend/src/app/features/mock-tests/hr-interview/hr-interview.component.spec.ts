import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrInterviewComponent } from './hr-interview.component';

describe('HrInterviewComponent', () => {
  let component: HrInterviewComponent;
  let fixture: ComponentFixture<HrInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrInterviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
