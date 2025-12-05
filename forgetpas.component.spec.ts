import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetpasComponent } from './forgetpas.component';

describe('ForgetpasComponent', () => {
  let component: ForgetpasComponent;
  let fixture: ComponentFixture<ForgetpasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetpasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetpasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
