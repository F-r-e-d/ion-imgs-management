import { TestBed } from '@angular/core/testing';

import { FilepickerService } from './filepicker.service';

describe('PickfileService', () => {
  let service: FilepickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilepickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
