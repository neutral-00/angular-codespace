In an architect-level interview, you need to demonstrate that you understand Signals not just as a syntax replacement, but as Angular's fundamental shift toward **fine-grained reactivity without Zone.js**. The interviewer will want to see that you know the mechanics, the trade-offs, and when *not* to use them.

Here is everything you need to know, structured the way a strong interview answer would flow.

### 1. The Core Mental Model: What Is a Signal?

A Signal is a **wrapper around a value** that notifies interested consumers when that value changes . It is a getter function. You read it by calling it (`count()`), which allows Angular to track exactly where that value is used. This tracking is the foundation of fine-grained change detection.

**Key types:**
- **WritableSignal**: Created with `signal(initialValue)`. You update it with `.set(newValue)` or `.update(fn)` .
- **Computed**: A read-only signal derived from other signals via `computed(fn)`. It is **lazily evaluated and memoized**—the derivation function does not run until you read the computed signal, and the result is cached until a dependency changes .
- **LinkedSignal**: A **writable** signal whose default value is derived from another signal, but which can also be manually overwritten. This solves the problem of "dependent state that the user can also edit" (e.g., selecting a default shipping option that updates when options change, but preserving the user's choice if possible) .

**The classic interview distinction:**
> "Computed is for *derived* state. LinkedSignal is for *dependent but writable* state. If you need `selectedOption` to reset when `options` changes but still allow the user to pick one, you need `linkedSignal`, not `computed`."

---

### 2. The "Why": Signals vs. Zone.js Change Detection

This is where architect candidates separate themselves. You must explain the *performance implication*.

Under Zone.js, any async browser event (setTimeout, Promise, click) triggers change detection across the entire component tree "just in case." Signals flip this: **change detection is triggered explicitly when a signal consumed by a template changes** .

**Interview-ready phrasing:**
> "Signals enable Zoneless change detection. Instead of Zone.js patching every async API to schedule a global check, Angular tracks signal dependencies at the template level. When a signal changes, Angular knows exactly which components consume it and marks only those for update. This is fine-grained reactivity. It also means third-party libraries that rely on Zone patching will silently break in a Zoneless app—that's the migration risk you have to audit for." 

---

### 3. Effects: The Most Misunderstood Primitive

If you mention `effect()` in an interview, be prepared for the follow-up: **"What should you *not* use effects for?"**

An `effect` runs whenever tracked signal values change. It always runs at least once and executes asynchronously during change detection .

**Valid use cases (sync to imperative APIs):**
- Logging/analytics
- Syncing state to `localStorage`
- Custom Canvas rendering or third-party chart integration 

**The critical rule (red flag if you get this wrong):**
> "Never use an effect to propagate state between signals. If you find yourself calling `.set()` on a signal inside an effect to keep two signals in sync, you are creating a race condition and potential infinite loops. Use `computed()` or `linkedSignal()` for state derivation. Effects are for escaping the reactive graph into the imperative world, not for staying inside it." 

**Advanced distinction:** `afterRenderEffect` vs `effect`. `effect` runs *before* Angular updates the DOM. If you need to read or modify the DOM based on a signal change (e.g., measuring an element), use `afterRenderEffect`, which runs *after* rendering and enforces read/write phases to avoid layout thrashing .

---

### 4. Signals vs. RxJS: The Architect's Boundary

This is a standard senior/architect question. The wrong answer is "Signals replace RxJS." The right answer is a **clear boundary of responsibility**.

| | **Signals** | **RxJS Observables** |
|---|---|---|
| **Best for** | Synchronous UI state, derived values, component-local state | Async streams, event composition, HTTP with operators (debounce, switchMap, retry) |
| **Angular integration** | Native, fine-grained change detection | Requires `async` pipe or manual subscription management |
| **Predictability** | Synchronous, glitch-free derivation | Time-based, operator-dependent |

**Interop is expected:**
- `toSignal(observable$)`: Convert an Observable stream into a Signal for template consumption. Handles subscription cleanup automatically.
- `toObservable(signal)`: Convert a Signal into an Observable to leverage RxJS operators (e.g., `debounceTime` on a search query before an HTTP call) .

**Interview-ready phrasing:**
> "I use Signals for state and RxJS for events and async orchestration. If I have a search input, the query itself is a Signal. I convert it to an Observable with `toObservable` to debounce and `switchMap` the HTTP call, then convert the result back with `toSignal` for the template. The component never manually subscribes."

---

### 5. Common Traps and Advanced Details

**Dynamic dependencies in computed:**
A `computed` only tracks the signals actually read during its derivation. If a conditional branch is not taken, that signal is not a dependency. This is powerful but can surprise you if you assume a computed always depends on everything it *could* read .

**Signal equality:**
Signals use `Object.is` by default to determine if a value changed. For objects and arrays, this means a new reference triggers propagation. Be aware of this when updating arrays (use immutable updates) or when you want to customize equality.

**Reading signals in `OnPush` components:**
When a signal is read in an `OnPush` component template, Angular tracks it as a dependency and automatically marks the component for check when it changes. This is the mechanism that makes Signals + `OnPush` (or Zoneless) so efficient .

---

### 6. A Likely Scenario Question

**"You have a dashboard with a list of stocks and a computed total portfolio value. The list is updated via WebSocket. How do you design it?"**

A strong answer:
- The stock list is a `WritableSignal<Ticker[]>`.
- The total is a `computed(() => tickers().reduce(...))`.
- The WebSocket handler calls `tickers.update(...)` with an immutable update.
- Because the total is computed, it is **lazily recalculated only when read** (by the template), and **memoized**—it will not recalculate on every WebSocket tick if the template doesn't read it.
- If the user can also manually override the total (e.g., adding cash), that override would be a `linkedSignal` derived from the computed total.
- No `effect` is used for state derivation. No manual subscription management. The template reads signals; Angular handles the rest.

---

**The one-sentence summary for the interview:**
> "Signals are Angular's fine-grained reactivity primitive. They make change detection explicit and trackable, they enable Zoneless applications, and they force a clean separation between derived state (computed), writable dependent state (linkedSignal), and side effects (effects). The architect's job is knowing where Signals end and RxJS begins, and auditing for Zone-dependent code that will break when you remove the safety net."