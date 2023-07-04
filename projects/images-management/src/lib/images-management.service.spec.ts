import { TestBed } from '@angular/core/testing';

import { ImagesManagementService } from './images-management.service';

describe('ImagesManagementService', () => {
  let service: ImagesManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
