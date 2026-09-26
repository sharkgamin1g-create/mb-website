# AGENT INSTRUCTIONS

This repository is a Next.js 16 portfolio site built with the App Router, TypeScript, and Tailwind CSS.

## Project overview
- App routes live under `app/`.
- Reusable UI sits in `components/`.
- Shared config and central navigation/content live in `lib/`.
- Styling is primarily Tailwind utility classes; prefer composition via the `cn()` helper in `lib/utils.ts`.
- Use the `@/*` alias for imports when referencing local modules.

## Working rules
- Prefer the existing structure and naming patterns instead of creating new architectural conventions.
- Keep changes scoped to the task and avoid unrelated refactors.
- Favor server components by default. Add `'use client'` only when browser-only state, effects, or DOM APIs are required.
- Preserve the current design language: polished marketing pages, subtle motion, dark navy/white visual system, and clear typography.
- Reuse existing sections and component patterns before introducing a new abstraction.
- Do not add dependencies unless clearly necessary for the requested task.

## Content and data conventions
- Route-specific content should remain in the relevant page or section component whenever possible.
- Shared content such as navigation and marketing copy should be centralized in `lib/site-data.ts` when reused across pages.
- Keep metadata, page structure, and content updates coherent with the existing brand pattern.

## Validation
- Run `pnpm build` after meaningful changes to verify the app still compiles.
- If adjusting UI, check the affected route in a browser or through the dev server when possible.

## Implementation hints
- Use `next/link` for router navigation.
- Follow the existing `lucide-react` icon usage, `clsx`/`cn` class merging, and component layout patterns already present in the project.
- Keep component props simple and typed.
- Preserve accessible labeling, semantic HTML, and responsive behavior on mobile and desktop.

## Important notes
- The repository is intentionally opinionated and design-led; maintain that look and feel during edits.
- When you are unsure, match the surrounding file’s coding style instead of inventing a new pattern.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
