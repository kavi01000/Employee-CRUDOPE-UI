import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqualificationComponent } from './mqualification.component';

describe('MqualificationComponent', () => {
  let component: MqualificationComponent;
  let fixture: ComponentFixture<MqualificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MqualificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MqualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
