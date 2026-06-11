Design Tokens & Guidelines

- Accent color: use the `.accent` utility (applies `--accent` token) for primary values like prices and primary actions.
- Muted text: use `.muted` for secondary text and captions.
- Minimal cards: use `.card-minimal` for list items, profile panels and admin panels. It provides soft border, subtle background and consistent padding.
- Buttons: use `Button` component with variants: default (primary), `variant="secondary"`, and `className="btn-pill"` for prominent CTA. Keep labels short.
- Spacing: prefer compact spacing (p-4 / p-5) for lists, use p-6 for primary panels.
- Typography: headings use `fw-semibold` and body secondary text should use `muted`.

Component usage examples

- Card:
  - `<div className="card-minimal p-5">...</div>`
- Button:
  - `<Button className="btn-pill">Acheter</Button>`
  - `<Button variant="secondary">Annuler</Button>`

Purpose

Provide a consistent minimalist, creative visual language across the frontend: soft surfaces, clear hierarchy, generous whitespace and a single accent color for calls-to-action and important values.
