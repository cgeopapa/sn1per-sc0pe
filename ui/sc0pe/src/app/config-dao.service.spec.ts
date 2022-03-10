import { TestBed } from '@angular/core/testing';

import { ConfigDaoService } from './config-dao.service';

describe('ConfigDaoService', () => {
  let service: ConfigDaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigDaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
