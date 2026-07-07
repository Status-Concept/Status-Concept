# Plan 006: Make the translation observer single-pass (stop double full-tree walks)

> **Executor instructions**: Follow step by step; verify each step. On any
> STOP condition, stop and report. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat f56df33..HEAD -- src/components/TranslationLayer.jsx`
> On mismatch with "Current state", STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 001 (translation smoke tests are the safety net)
- **Category**: perf
- **Planned at**: commit `f56df33`, 2026-07-07

## Why this matters

The translation layer's MutationObserver re-walks every text node under `#root` on every DOM mutation. Worse, its own writes (`node.nodeValue = …`) enqueue `characterData` mutations; the reentrancy guard is synchronous while observer callbacks fire on a microtask, so the guard is already `false` when the self-induced batch arrives — every real mutation costs ~2 full-tree walks. On the products grid (50+ cards, thousands of text nodes) this is wasted main-thread work on every interaction, for every visitor.

## Current state

`src/components/TranslationLayer.jsx` (bottom of file):

```jsx
useEffect(() => {
  let applying = false
  const run = () => {
    if (applying) return
    applying = true
    applyTranslations(lang)
    applying = false
  }

  run()
  const observer = new MutationObserver(run)
  const root = document.getElementById('root')
  if (root) observer.observe(root, { childList: true, subtree: true, characterData: true })

  return () => observer.disconnect()
}, [lang, location.pathname, location.search])
```

`applyTranslations(lang)` creates a `TreeWalker` over `#root` and calls `translateTextNode` per text node. `translateTextNode` is idempotent (second pass sees `node.nodeValue === nextValue` and does nothing), which is the only reason the current loop terminates.

The dynamic-text re-capture logic in `translateTextNode` (re-reads `node.nodeValue` when it changed outside the layer, via `originalText`/`lastApplied` WeakMaps) MUST keep working — React frequently rewrites text (counts, form state), and those nodes must re-translate.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Tests | `npm test` | translation tests pass |
| Build | `npm run build` | exit 0 |
| Lint | `npm run lint` | exit 0 |

## Scope

**In scope**:
- `src/components/TranslationLayer.jsx` (the effect/observer block only — do not restructure the dicts)

**Out of scope**:
- The translation dictionaries and `translateTextNode`'s matching semantics (plan 007 covers collision hardening).
- Replacing the i18n mechanism wholesale (deliberate keep-decision for now).

## Git workflow

- Branch `loop`; one commit: `Coalesce translation passes; ignore observer self-mutations`.

## Steps

### Step 1: Suppress self-induced observer work and coalesce bursts

Replace the effect body with a version that (a) disconnects the observer while applying, then reconnects — so the layer's own writes never re-trigger it; and (b) coalesces mutation bursts into one pass per animation frame:

```jsx
useEffect(() => {
  const root = document.getElementById('root')
  if (!root) return

  const observer = new MutationObserver(() => schedule())
  const observe = () => observer.observe(root, { childList: true, subtree: true, characterData: true })

  let frame = null
  const schedule = () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = null
      observer.disconnect()          // our own writes must not re-trigger
      applyTranslations(lang)
      observe()
    })
  }

  applyTranslations(lang)            // initial pass, synchronous
  observe()

  return () => {
    if (frame) cancelAnimationFrame(frame)
    observer.disconnect()
  }
}, [lang, location.pathname, location.search])
```

Keep `applyTranslations`/`translateTextNode` untouched.

**Verify**: `npm test` → translation tests still pass (including the dynamic-text case if present); `npm run lint` → exit 0.

### Step 2: Manual behavior check

`npm run dev`, open `/#/pt/products?cat=lounge`:
1. Page chrome renders in PT (initial pass works).
2. Toggle a favorite (heart) — any toast/counter text still translates (observer path works after reconnect).
3. Navigate PT→EN→PT via the language switcher — full page flips language each time.
4. In DevTools Performance, a single click no longer produces two `applyTranslations`-dominated tasks (optional sanity check, not a gate).

**Verify**: behaviors 1-3 hold.

## Test plan

Covered by plan 001's TranslationLayer tests; if a dynamic-text regression case is missing there, add one: render a component whose text node changes after mount (state update) and assert the new value gets translated on the next frame (`await waitFor`).

## Done criteria

- [ ] Observer disconnects during its own writes and coalesces via rAF
- [ ] `npm test` green; build + lint exit 0
- [ ] Manual checks 1-3 pass
- [ ] `plans/README.md` updated

## STOP conditions

- The effect block no longer matches the excerpt (drift).
- Translation of dynamic text (check 2) breaks and one honest fix attempt fails — revert and report; the WeakMap re-capture interplay is the risky bit.

## Maintenance notes

- If a future page animates text via requestAnimationFrame every frame, translation now lags one frame behind — acceptable; note it.
- Plan 007 (collision guard) edits the same file — land this first, it's the smaller diff.
