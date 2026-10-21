import { TestBed } from '@angular/core/testing';
import { MarketFeed } from './market-feed';

describe('MarketFeed', () => {
  let service: MarketFeed;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketFeed);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
