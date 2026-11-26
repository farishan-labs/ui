# Pattern: Compact Responsive Header

> Stack-agnostic. Applies to any web UI (React, Vue, Svelte, Astro, vanilla, web
> components, server-rendered). Captured from a real mobile-responsiveness pass on
> an auth split-screen layout. Use this as a checklist when building or reviewing
> a header that must stay compact on small screens.

## When to use

A top bar containing a **brand block** (logo + name/tagline) and an optional
**utility slot** (e.g. "Don't have an account? Sign up →"), shown only on
small viewports where the full desktop layout (hero panel, sidebar, etc.) is
hidden.

## The pattern

```
[ logo  name / tagline ]   [ utility link ]
```

- One row on mobile, pushed apart (space-between).
- Brand on the left, utility on the right.
- Utility text is secondary; it may shorten or wrap, but must remain readable.

## Rules

### 1. Scope brand renames

When renaming a brand, **do not touch taglines/subtitles**. A rename commit
that blindly replaces "Old Tagline" → "New Brand Name" turned the
mobile subtitle into a duplicate of the title.

- ✅ Mobile subtitle === desktop subtitle (single source of truth).
- ❌ Letting a find/replace rewrite copy that happens to contain the old word.

### 2. Don't put multi-word sentences in a nowrap flex row in tight space

A `flex` row with `nowrap` and 2+ text children forces **each child to wrap
independently**, producing a cramped 2-column × N-line block that reads
poorly.

- ✅ Normal flow (block/inline) so the sentence wraps as a sentence.
- ✅ Or `flex-wrap: wrap` so a too-wide item drops to its own line.
- ❌ `flex; flex-wrap: nowrap` for a sentence that can't fit on one line.

### 3. Shorten copy on mobile only

Keep the full wording on larger screens; show a compact fallback on mobile.
Use responsive visibility toggles (not separate components).

Example (generic):

```html
<span class="hidden sm:inline">Don't have an account? </span>
<a href="/register">
  <span class="sm:hidden">Sign up →</span>
  <span class="hidden sm:inline">Sign up now →</span>
</a>
```

- Mobile shows "Sign up →"; `sm+` shows "Don't have an account? Sign up now →".
- ❌ Shipping the full sentence on a 360px screen where it wraps 2–3 times.

### 4. Always keep a switch affordance

The login↔register toggle (or equivalent) is often the **only** navigation
between the two screens. Never remove it; if space is tight, shorten it (rule 3),
don't delete it.

### 5. Budget header height

Mobile headers should stay ~32–40px tall. A 70px header on a 667px screen
eats ~10% of the viewport before the form appears.

- Measure the rendered header height in your smallest target viewport.
- If it exceeds ~40px, compact the brand (hide tagline, shrink logo) or
  shorten the utility.

### 6. Verify no horizontal overflow

At your smallest target width (360–390px), assert:

```
scrollWidth === clientWidth   (no horizontal scroll)
```

Common culprits: long unbreakable strings, fixed-width children, `nowrap` flex
rows with `space-between` where children sum to more than the content box.

### 7. Measure with real emulation + a HUD

- Use headed automation (Playwright/Puppeteer) at 360/375/390/412px.
- Inject an in-page "agent mind" HUD so walkthroughs are narrated and
  screenshotable.
- Check tap targets ≥ 44×44px for links/buttons.
- Re-run after every copy or layout change.

## Do / Don't

| Do                                                      | Don't                                           |
| ------------------------------------------------------- | ----------------------------------------------- |
| Match mobile subtitle to desktop subtitle               | Let renames rewrite taglines                    |
| Let sentences wrap as sentences (block/inline flow)     | `nowrap` flex rows for sentences in tight space |
| Shorten on mobile, full on `sm+` via visibility toggles | Ship full verbose copy on 360px                 |
| Keep the switch link (shortened if needed)              | Remove the only nav affordance to save space    |
| Budget ~32–40px header height                           | Let the header grow to 70px+                    |
| Assert `scrollWidth === clientWidth`                    | Ship without checking overflow                  |
| Measure at 360/375/390/412px with headed automation     | Trust desktop preview only                      |

## Minimal example (framework-agnostic)

```html
<header class="mb-6 flex items-center justify-between">
  <!-- brand -->
  <a href="/" class="inline-flex items-center gap-2">
    <img src="/logo.png" alt="Brand" width="36" height="36" />
    <span class="flex flex-col">
      <span class="text-sm font-bold">Brand Name</span>
      <span class="text-xs text-muted">Tagline matching desktop</span>
    </span>
  </a>

  <!-- utility: short on mobile, full on sm+ -->
  <div class="text-xs text-muted">
    <span class="hidden sm:inline">Don't have an account? </span>
    <a href="/register" class="font-bold">
      <span class="sm:hidden">Sign up →</span>
      <span class="hidden sm:inline">Sign up now →</span>
    </a>
  </div>
</header>
```

## Review checklist

- [ ] Mobile subtitle === desktop subtitle
- [ ] No duplicated brand text
- [ ] Utility text fits or wraps as a sentence (no 2-column wrap)
- [ ] Shortened mobile variant exists and is visible only below `sm`
- [ ] Switch affordance present
- [ ] Header height ≤ ~40px at 390px
- [ ] `scrollWidth === clientWidth` at 360/375/390/412px
- [ ] Tap targets ≥ 44×44px
- [ ] Verified with headed automation + screenshot

## Breakpoint validation (anti-overflow)

When choosing a breakpoint for "stacked on small, side-by-side if room":

1. **Measure the available width** at the candidate breakpoint (the parent
   container, not the viewport). E.g. a `lg:col-span-5` card at 1024px is
   ~395px wide, not 1024px.
2. **Compute the required width**: `2 × (contentWidth + padding) + gap`.
   If the container is narrower than this, side-by-side will overflow.
3. **Don't trust Tailwind defaults.** `sm:` (640px) is often far too early.
   Pick the breakpoint where the container actually exceeds the required width
   (here, `xl:` = 1280px).
4. **Test the in-between widths** (1024px, 1280px), not just mobile (390px)
   and desktop (1440px). Tablet/medium is where layouts silently break.
5. **Watch for `min-w-0` masking overflow.** It lets flex items shrink below
   their content size, so `scrollWidth ≈ clientWidth` can look "fine" while
   text touches the edge. Also check `leftOfContent === 0` / content filling
   the whole element.

## Spacing utilities and hidden siblings

`space-y-*` / `space-x-*` apply margin to **every** child except the first,
including `aria-hidden` inputs that form primitives (Select, Combobox, etc.)
render for value submission. Those take no visual space but still receive
margin, producing phantom gaps below the visible element.

- ✅ Inspect the rendered DOM, not just the JSX — hidden siblings are injected
  by the primitive and won't appear in your component code.
- ✅ Measure `containerBottom - elementBottom`; a value > 0 means dangling
  margin.
- ✅ Prefer targeted margins (`mb-1.5` on the label) over blanket `space-y-*`
  when the wrapper may contain non-visual children.
- ❌ Assume `space-y-*` only affects visible elements.

## Shared-component edits (anti-regression)

When a visual change is requested for **one** consumer of a shared layout
component:

1. **Enumerate consumers first.** Grep for the component name; list every call
   site and its expected behavior. (e.g. `AuthSplitLayout` is used by login,
   register, forgot-password, reset-password, complete-profile.)
2. **Don't mutate the shared default.** A global edit to satisfy one consumer
   silently flips the others — same class of bug as an over-broad rename commit.
3. **Add a prop with a sensible default.** Keep the majority behavior as the
   default; let the minority opt in (e.g. `topUtilityAlign` defaults to
   `'end'`, forgot/reset pass `'start'`).
4. **Verify every consumer** after the change, not just the one being fixed.

## Origin

Distilled from a mobile-responsiveness pass on an auth split-screen layout:
mobile brand header, subtitle duplication from an over-broad rename commit,
and a nowrap flex row that wrapped each chunk independently. Fixes: subtitle
set to the desktop tagline; utility converted to block flow with mobile-only
shortening.
