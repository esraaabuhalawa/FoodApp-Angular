import { TestBed } from '@angular/core/testing';

import { FavoritService } from './favorit.service';

describe('FavoritService', () => {
  let service: FavoritService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
