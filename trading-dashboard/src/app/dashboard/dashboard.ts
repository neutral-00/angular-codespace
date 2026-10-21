import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MarketFeed } from '../market-feed';

@Component({
  imports: [DecimalPipe],
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  readonly feed = inject(MarketFeed);
}
