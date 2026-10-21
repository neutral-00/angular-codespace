## 📘 Lesson 1: Zoneless Thinking & a High-Frequency Dashboard

### 🎯 Lesson Objective

You will build a **simulated stock ticker board** from scratch. It updates prices dozens of times per second. Your goal: **the page stays smooth, and only the changed price cells trigger re-rendering**. This is a direct rehearsal for the common architect interview question: "How do you handle high-frequency updates?"

### 🧠 Why Start with Zoneless

Angular 21 no longer includes zone.js by default in new applications . Previously, any `setTimeout`, `Promise`, or DOM event could trigger application-wide change detection. Now, change detection only happens when you **explicitly notify Angular**—typically through a Signal update.

This has three immediate consequences:

- High-frequency `requestAnimationFrame` or WebSocket pushes no longer trigger full-tree checks automatically.
- If you still use mutable plain objects plus manual `markForCheck`, you are fighting the framework.
- **Architect interview trap**: "After moving to Zoneless, which old code patterns silently break?" The correct answer points to third-party libraries that depend on Zone patches and asynchronous state updates that were never converted to Signals .

### 🛠️ Hands-On Steps

**Step 1: Create a Zoneless project**

```bash
npx @angular/cli new trading-dashboard
cd trading-dashboard
```

Angular 21 CLI generates Zoneless applications by default. Verify that `app.config.ts` includes `provideZonelessChangeDetection()` .

**Step 2: Define the market data model and simulated feed**

Create a `MarketFeedService`. Key design decision: **do not expose the raw Observable push; expose a Signal instead**. This is a common architect-level "boundary encapsulation" decision—let components consume Signals while locking RxJS complexity inside the service layer.

```typescript
// market-feed.service.ts
import { Injectable, signal } from '@angular/core';

export interface Ticker {
  symbol: string;
  price: number;
  change: number;
}

@Injectable({ providedIn: 'root' })
export class MarketFeedService {
  private readonly _tickers = signal<Ticker[]>([]);
  readonly tickers = this._tickers.asReadonly();

  constructor() {
    this.startSimulation();
  }

  private startSimulation(): void {
    setInterval(() => {
      this._tickers.update(prev => {
        if (prev.length === 0) {
          return ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'].map(s => ({
            symbol: s,
            price: 100 + Math.random() * 200,
            change: 0,
          }));
        }
        const idx = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        const old = updated[idx];
        const newPrice = old.price * (1 + (Math.random() - 0.5) * 0.01);
        updated[idx] = { ...old, price: newPrice, change: newPrice - old.price };
        return updated;
      });
    }, 100);
  }
}
```

Notice: under Zoneless, `setInterval` does **not** trigger change detection on its own. Only the Signal write inside `_tickers.update()` notifies Angular to schedule an update. This is exactly the control we want.

**Step 3: Component consumes the Signal and renders precisely with `@for`**

```typescript
// dashboard.component.ts
import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MarketFeedService } from './market-feed.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <h2>Live Market</h2>
    <table>
      <thead>
        <tr><th>Symbol</th><th>Price</th><th>Change</th></tr>
      </thead>
      <tbody>
        @for (t of feed.tickers(); track t.symbol) {
          <tr>
            <td>{{ t.symbol }}</td>
            <td [class.up]="t.change > 0" [class.down]="t.change < 0">
              {{ t.price | number:'1.2-2' }}
            </td>
            <td>{{ t.change | number:'1.2-2' }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    .up { color: green; }
    .down { color: red; }
    table { width: 100%; border-collapse: collapse; }
    td, th { padding: 8px; border-bottom: 1px solid #ddd; text-align: left; }
  `]
})
export class DashboardComponent {
  readonly feed = inject(MarketFeedService);
}
```

The key line is `track t.symbol` inside `@for`. It ensures Angular updates only the `<tr>` whose price changed, rather than rebuilding the entire table. In an interview, you should be able to explain that this is the modern built-in replacement for `trackBy`, but with cleaner syntax.

**Step 4: Verify Zoneless behavior**

Open the Performance panel in DevTools and record for 5 seconds. You should see: **each Signal update corresponds to a very small change detection cycle**, not a full check. Then, as a contrast, try replacing the Signal update in `setInterval` with a plain class property assignment (e.g., `this.tickers = newArray`). The page will **not update at all**. This proves Zoneless is active and that you are now responsible for explicit reactivity.

### 🧪 Interview-Linked Self-Check

After finishing the code, answer these questions aloud. This mirrors the real rhythm of an architect interview:

1. **"If I replace `signal.update` in `setInterval` with a plain property assignment, what happens to the page?"**
   → The page will not update. Under Zoneless, there is no Zone patch to detect plain property changes. You must use Signals, `markForCheck()`, or a template event to trigger change detection .

2. **"If this dashboard needs a Canvas K-line chart redrawn every frame, how do you ensure it does not affect the table rendering?"**
   → Wrap the Canvas drawing loop in `NgZone.runOutsideAngular`, and only re-enter the Angular zone when data bound to the template needs updating. Under Zoneless, you are even more likely to drive Canvas with `requestAnimationFrame` directly, fully decoupled from Angular change detection.

3. **"If a teammate insists on using an RxJS `BehaviorSubject` to drive this table, how would you refactor it?"**
   → Convert the Observable to a Signal at the service layer using `toSignal(subject$)`, and let the component consume only the Signal. This preserves RxJS operator capabilities while giving the template fine-grained updates.

---

## ⏭️ Next Lesson Preview

**L2: Signal Forms and a Multi-Step Approval Flow**

You will build a loan application form with conditional fields, cross-step validation, and auto-save. The core challenge: how to use Signal Forms' field tree to replace the nested `FormGroup` structure, and why—from an architect's perspective—**form state serializability and testability** matter more than "writing less code."