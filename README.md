# Customer Feedback Form

A customer feedback widget built with React, TypeScript, and Vite. Users submit their name, a message, and a 1–5 star rating. Submissions appear in a scrollable list below the form and are persisted to `localStorage`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

To create a production build:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── FeedbackForm.tsx    # Form with validation + star rating
│   ├── FeedbackList.tsx    # Renders submitted reviews
│   └── StarRating.tsx      # Interactive 1–5 star input
├── assets/
│   └── quote.svg           # Quotation mark icon for cards
├── types.ts                # Shared FeedbackEntry type
├── App.tsx                 # Root component, state + localStorage
├── main.tsx                # Entry point
└── index.css               # Global reset + base styles
```

## Technical Decisions

**Star rating from scratch.** The spec explicitly prohibits third-party rating libraries. The component uses inline SVG `<path>` elements for the star shape, rendered inside bordered buttons. Hover state previews the selection; clicking commits it. Hovering out reverts to the committed value. This is managed with a single `hovered` state alongside the controlled `value` prop.

**Validation approach.** Name and message fields use native HTML `required` validation — the browser handles error display with no extra code. The star rating can't use native validation since it's not a standard form input, so it has a separate `ratingError` state that triggers an inline message on submit when no stars are selected.

**localStorage for persistence.** Entries serialize to JSON in `localStorage` on every submission and deserialize on mount via a lazy initializer passed to `useState`. A `try/catch` in the loader handles corrupted data without crashing the app. This keeps the app functional across refreshes without needing a backend.

**Sticky sidebar text.** The "We help make claims easier..." heading uses `position: sticky` so it remains visible as users scroll through a long feedback list. The parent section uses `overflow: clip` instead of `overflow: hidden` — `hidden` creates a new scroll context that breaks sticky positioning, while `clip` only clips visual overflow.

**Alternating card layout.** Feedback cards alternate between `flex-start` and `flex-end` alignment using `:nth-child(odd/even)`. Each card has a `::after` pseudo-element clipped into a triangle to create a speech-bubble tail, with the tail direction flipped for even cards.

**Expandable messages.** Long feedback messages are clamped to a `max-height` with a CSS `mask-image` fade. A `useEffect` compares the element's `scrollHeight` against the threshold on mount — if it overflows, a "See more" toggle appears. Clicking it removes the clamp class; "See less" re-applies it. This avoids CSS-only `-webkit-line-clamp` which doesn't support a fade gradient and has no toggle mechanism.

**Responsive layout.** Two breakpoints at 1024px and 640px. The form section and feedback list switch from side-by-side to stacked layouts on smaller viewports. Fixed widths become fluid, sticky positioning is disabled on mobile, and typography scales down.

**Typography.** The app uses [Public Sans](https://fonts.google.com/specimen/Public+Sans) (weights 400, 500, 600, 700) loaded via Google Fonts, matching the Figma design specs.

---

## Contentful Content Modeling

Below is how I would model the two sections (the form + feedback list) as Contentful content types.

### `feedbackFormSection`

Configurable content for the form area — allows editors to update copy without touching code.

| Field               | Type       | Required | Notes                                             |
| ------------------- | ---------- | -------- | ------------------------------------------------- |
| `heading`           | Short Text | Yes      | e.g. "Your feedback helps us grow"                |
| `description`       | Long Text  | Yes      | Subtext below the heading                         |
| `namePlaceholder`   | Short Text | No       | Placeholder for the name input (default: "Name")  |
| `messagePlaceholder`| Short Text | No       | Placeholder for the textarea                      |
| `submitButtonText`  | Short Text | No       | e.g. "Submit ›"                                   |
| `maxRating`         | Integer    | No       | Number of stars (default: 5)                      |

### `feedbackListSection`

Configurable content for the feedback list area.

| Field         | Type       | Required | Notes                                              |
| ------------- | ---------- | -------- | -------------------------------------------------- |
| `heading`     | Short Text | Yes      | e.g. "We help make claims easier for brokers, too" |
| `description` | Long Text  | Yes      | Subtext below the heading                          |

### `feedbackEntry`

Each submitted review. In production, submissions would be written via the Content Management API.

| Field     | Type       | Required | Validation  |
| --------- | ---------- | -------- | ----------- |
| `name`    | Short Text | Yes      | —           |
| `message` | Long Text  | Yes      | —           |
| `rating`  | Integer    | Yes      | Range: 1–5  |

### How it connects

A parent **Page** content type references one `feedbackFormSection` and one `feedbackListSection` via Reference fields. The list section could include a Reference (many) field to `feedbackEntry` items for pre-seeded reviews. In production, new submissions would create `feedbackEntry` entries via the Management API, and the list would query the Delivery API.
