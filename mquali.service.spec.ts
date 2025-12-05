import { TestBed } from '@angular/core/testing';

import { MqualiService } from './mquali.service';

describe('MqualiService', () => {
  let service: MqualiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqualiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
