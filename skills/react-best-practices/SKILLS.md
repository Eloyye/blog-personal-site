---
name: react-performance-best-practices
description: React performance optimization guidelines for writing, reviewing, or refactoring React code. Use when working on React components, hooks, client-side data fetching, bundle size, rendering behavior, or JavaScript performance. Framework-neutral; do not assume any full-stack framework, router, server rendering model, or deployment-provider API.
license: MIT
metadata:
  version: "1.0.0"
---

# React Performance Best Practices

Apply these guidelines when writing, reviewing, or refactoring React applications for better runtime performance, bundle size, rendering behavior, and responsiveness. This skill is intentionally framework-neutral: prefer patterns that work across React apps regardless of router, bundler, hosting provider, or full-stack framework.

## When to Apply

Use this skill when:

- Writing new React components or hooks
- Reviewing React code for performance issues
- Refactoring React components, state flow, effects, or memoization
- Optimizing client bundle size or lazy-loading behavior
- Improving client-side data fetching and request deduplication
- Reducing unnecessary renders, expensive render work, layout cost, or main-thread blocking

Do not use this skill as a substitute for framework-specific documentation. If the task depends on a specific framework, router, bundler, data library, SDK, or CLI, fetch current documentation for that tool before applying framework-specific advice.

## Priority Categories

| Priority | Category                 | Impact      | Prefix       |
| -------- | ------------------------ | ----------- | ------------ |
| 1        | Eliminating Waterfalls   | Critical    | `async-`     |
| 2        | Bundle Size Optimization | Critical    | `bundle-`    |
| 3        | Data Fetching            | Medium-High | `data-`      |
| 4        | Re-render Optimization   | Medium      | `rerender-`  |
| 5        | Rendering Performance    | Medium      | `rendering-` |
| 6        | JavaScript Performance   | Low-Medium  | `js-`        |
| 7        | Advanced Patterns        | Low         | `advanced-`  |

## 1. Eliminating Waterfalls

- `async-cheap-condition-before-await` - Check cheap synchronous conditions before awaiting remote values.
- `async-defer-await` - Move `await` into the branch where the value is actually needed.
- `async-parallel` - Use `Promise.all()` for independent asynchronous operations.
- `async-dependencies` - Separate independent work from dependent work so only true dependencies block.
- `async-start-early` - Start known async work early, then await it as late as practical.
- `async-suspense-boundaries` - Use Suspense boundaries where supported to reveal independent UI progressively.

## 2. Bundle Size Optimization

- `bundle-direct-imports` - Prefer direct imports when barrel files pull in unrelated code.
- `bundle-analyzable-paths` - Use statically analyzable import paths so bundlers can tree-shake and split code effectively.
- `bundle-dynamic-imports` - Lazy-load heavy components, rarely used flows, and optional features with `React.lazy()` or the app's bundler-supported dynamic import pattern.
- `bundle-defer-third-party` - Load analytics, logging, widgets, and other third-party scripts after the critical UI is usable.
- `bundle-conditional` - Load modules only when the feature is activated.
- `bundle-preload` - Preload likely next interactions on hover, focus, idle time, or route intent when the product benefits from it.

## 3. Data Fetching

- `data-dedup` - Deduplicate identical client requests with the app's data layer, cache, or query library.
- `data-cache-scope` - Match cache lifetime and invalidation to the data's real freshness requirements.
- `data-minimize-payload` - Fetch and pass only the fields the UI needs.
- `data-parallel-fetching` - Parallelize independent requests instead of fetching sequentially during render or effects.
- `data-abort-stale-requests` - Abort or ignore stale requests when dependencies change.
- `data-avoid-effect-waterfalls` - Avoid effect chains where one component fetch must complete before child components can discover their own fetches.

## 4. Re-render Optimization

- `rerender-defer-reads` - Do not subscribe to state that is only needed inside event callbacks.
- `rerender-memo` - Extract expensive render work into memoized components when props are stable.
- `rerender-memo-with-default-value` - Hoist default non-primitive props so memoized children receive stable references.
- `rerender-dependencies` - Prefer primitive dependencies in effects and memoization.
- `rerender-derived-state` - Subscribe to derived booleans or minimal values instead of broad raw state.
- `rerender-derived-state-no-effect` - Derive render state during render instead of syncing it with effects.
- `rerender-functional-setstate` - Use functional state updates to keep callbacks stable and avoid stale closures.
- `rerender-lazy-state-init` - Pass an initializer function to `useState` for expensive initial values.
- `rerender-simple-expression-in-memo` - Avoid `useMemo` for cheap primitive expressions.
- `rerender-split-combined-hooks` - Split hooks whose dependencies change independently.
- `rerender-move-effect-to-event` - Put interaction logic in event handlers instead of effects when it is caused by an event.
- `rerender-transitions` - Use `startTransition` for non-urgent updates that should not block input.
- `rerender-use-deferred-value` - Use `useDeferredValue` to keep input responsive while expensive views lag behind.
- `rerender-use-ref-transient-values` - Use refs for transient, frequently changing values that should not trigger renders.
- `rerender-no-inline-components` - Do not define component types inside other components.

## 5. Rendering Performance

- `rendering-animate-wrapper` - Animate a wrapper element when animating complex SVG or expensive subtrees.
- `rendering-content-visibility` - Use `content-visibility` or virtualization for large offscreen lists and panels.
- `rendering-hoist-jsx` - Extract static JSX outside components when it never depends on props or state.
- `rendering-svg-precision` - Reduce unnecessary SVG coordinate precision.
- `rendering-hydration-no-flicker` - Avoid client-only value flicker during hydration with a deliberate hydration strategy.
- `rendering-hydration-suppress-warning` - Suppress expected hydration mismatches only when the mismatch is intentional and harmless.
- `rendering-conditional-render` - Use explicit conditionals that do not accidentally render `0`, `false`, or empty values.
- `rendering-transition-loading` - Prefer transition-aware loading states for non-urgent UI changes.
- `rendering-resource-hints` - Use resource hints for critical fonts, scripts, and connections when measurements justify them.
- `rendering-script-defer-async` - Use `defer`, `async`, or equivalent non-blocking script loading for non-critical scripts.

## 6. JavaScript Performance

- `js-batch-dom-css` - Group DOM and style changes through classes, CSS variables, or batched writes.
- `js-index-maps` - Build a `Map` for repeated lookups instead of repeatedly scanning arrays.
- `js-cache-property-access` - Cache frequently used object properties inside hot loops.
- `js-cache-function-results` - Cache expensive pure function results when inputs repeat.
- `js-cache-storage` - Cache repeated `localStorage` or `sessionStorage` reads.
- `js-combine-iterations` - Combine multiple `filter`, `map`, and `reduce` passes when the data set is large or hot.
- `js-length-check-first` - Check array length before expensive comparisons.
- `js-early-exit` - Return early from functions once the answer is known.
- `js-hoist-regexp` - Hoist repeated `RegExp` construction out of loops and render paths.
- `js-min-max-loop` - Use a loop for min/max selection instead of sorting.
- `js-set-map-lookups` - Use `Set` or `Map` for repeated membership tests.
- `js-tosorted-immutable` - Use immutable array helpers such as `toSorted()` when runtime support and targets allow it.
- `js-flatmap-filter` - Use `flatMap` to combine mapping and filtering when it simplifies one-pass transformation.
- `js-request-idle-callback` - Defer non-critical work to idle time when supported, with a fallback for unsupported environments.

## 7. Advanced Patterns

- `advanced-effect-event-deps` - Do not put stable effect-event callbacks in effect dependency arrays when using React APIs that define that behavior.
- `advanced-event-handler-refs` - Store event handlers in refs when subscription identity must stay stable.
- `advanced-init-once` - Initialize app-wide services once per app load, with cleanup in tests and hot reload paths where needed.
- `advanced-use-latest` - Use a `useLatest`-style ref when a stable callback must read the newest value.

## Review Workflow

1. Identify the current bottleneck class: network waterfall, bundle cost, render frequency, render cost, JavaScript hot path, or hydration behavior.
2. Prefer measuring with profiler, bundle analyzer, browser performance tools, request traces, or focused instrumentation when practical.
3. Apply the highest-priority relevant rules first.
4. Keep changes local and evidence-based; do not add memoization, caching, or lazy loading where it increases complexity without a plausible performance win.
5. Verify behavior and performance-sensitive interactions after the change.

## Framework-Neutral Boundaries

- Do not assume framework file conventions, routing APIs, server-only mutation APIs, server-rendered component models, framework-specific dynamic import helpers, framework-specific script helpers, post-response lifecycle hooks, or deployment-provider behavior.
- Do not assume a specific data fetching library such as SWR, TanStack Query, Apollo, Relay, or Redux Toolkit Query. Use the project's existing data layer when present.
- Do not assume a specific bundler. Adapt dynamic imports, preloading, and analysis to the project's existing toolchain.
- Do not move logic between server and client unless the project's framework and deployment model explicitly support that architecture.

## Completion Criteria

Before finishing, confirm all of the following:

- Any performance recommendation is tied to a specific bottleneck or likely bottleneck.
- Framework-specific APIs were avoided unless the project already uses that framework and current docs were checked.
- Behavior remains unchanged unless the user explicitly requested a behavioral change.
- Relevant tests, type checks, linting, formatting, or manual verification ran, or any blocker was reported explicitly.
