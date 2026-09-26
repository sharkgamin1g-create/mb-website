# Copilot instructions

This repository is a Next.js 16 portfolio site using the App Router, TypeScript, and Tailwind CSS.

## Project structure
- Routes: `app/`
- Shared UI: `components/`
- Reusable content/config: `lib/`
- Styling: Tailwind utility classes, with `cn()` from `lib/utils.ts`

## Coding expectations
- Match the existing architecture and naming patterns.
- Prefer server components unless client-side browser logic is required.
- Maintain the current premium marketing/design language: clean layout, navy palette, subtle motion, responsive behavior.
- Reuse existing data patterns before adding new abstractions.
- Avoid unnecessary dependencies or broad refactors.

## Verification
- Run `pnpm build` after meaningful changes.
- Keep imports aligned with the current `@/*` alias setup.
