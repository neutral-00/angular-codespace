# Angular 21 Architect Interview Roadmap (Hands-On)

To target architect-level interviews, you need more than "how to use Angular." Interviewers probe your understanding of **change detection mechanics, performance boundaries, state management trade-offs, and large-scale application governance**. Angular 21 is a clear inflection point: **Zoneless is the default, Vitest is stable, and Signal Forms arrive as experimental** . This means you must move from "Zone.js magic" to an explicit reactive mindset.

Below is a hands-on roadmap built around real-world problems, followed by the first full lesson.

---

## 🗺️ Hands-On Roadmap (Ending in Architect-Level Readiness)

| Stage | Core Project | Architect Interview Focus | Key Deliverable |
|-------|--------------|---------------------------|-----------------|
| **L1: Modern Angular Foundation** | Build a **Zoneless real-time dashboard** handling high-frequency data | Why is Zoneless the default? How does `provideZonelessChangeDetection` change component design? | A working high-frequency dashboard with no whole-tree re-render |
| **L2: Reactive State & Forms** | Multi-step **loan/claims approval form** with conditional validation and auto-save | Signals vs. RxJS boundaries: when to use `toSignal`, when to keep Observables. Signal Forms field-tree design. | A type-safe complex form with a testable state flow |
| **L3: Performance & Rendering Discipline** | **Virtualized table with 10k+ rows + Canvas animation** | `@for` track mechanics, precise `NgZone.runOutsideAngular` use cases, `@defer` trigger strategies | A measurable performance comparison report (frame rate/memory before vs. after) |
| **L4: Architecture at Scale** | **Module Federation micro-frontend** admin portal | Micro-frontend boundary design, shared dependency governance, cross-app state synchronization | Three independently deployable micro-apps plus a shell |
| **L5: Testing & Delivery** | **Vitest test suite** covering L1–L4 plus CI pipeline | How to test Zoneless components. Signal Forms testing strategy. | A regression-ready suite with adequate coverage |
| **L6: Interview Simulation** | Whiteboard design: **enterprise Angular architecture proposal** | Change detection strategy selection, DI hierarchy design, third-party Zoneless compatibility assessment | A defensible architecture decision record |

---

