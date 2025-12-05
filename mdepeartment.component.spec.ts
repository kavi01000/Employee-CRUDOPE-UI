import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdepeartmentComponent } from './mdepeartment.component';

describe('MdepeartmentComponent', () => {
  let component: MdepeartmentComponent;
  let fixture: ComponentFixture<MdepeartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdepeartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdepeartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
