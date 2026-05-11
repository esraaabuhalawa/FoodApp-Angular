import { TestBed } from '@angular/core/testing';

import { FileUtilServiceService } from './file-util-service.service';

describe('FileUtilServiceService', () => {
  let service: FileUtilServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileUtilServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
