import { TestBed } from '@angular/core/testing';

import { MdeptService } from './mdept.service';

describe('MdeptService', () => {
  let service: MdeptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdeptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
