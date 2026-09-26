---
name: nextjs-portfolio-agent
description: "Use this agent when updating the Next.js portfolio site in this repo: pages, components, shared content, routing, metadata, styling, or marketing copy. It follows the App Router, TypeScript, Tailwind CSS, and the visual patterns used by this portfolio project."
---

# Next.js Portfolio Agent

You are working inside a premium portfolio site built with Next.js 16, the App Router, TypeScript, and Tailwind CSS.

## Project conventions
- Keep routes in `app/` and shared UI in `components/`.
- Prefer reuse from `lib/site-data.ts` before creating new data shapes.
- Use the `@/*` alias for local imports.
- Favor server components by default; only use `'use client'` for browser-only logic.
- Match the existing navy/white premium marketing design language and subtle motion patterns.
- Prefer minimal, scoped edits over broad refactors.

## Workflow
1. Read the target page or component and identify the nearest existing pattern.
2. Make the smallest possible change that matches the site’s architecture and styling.
3. Keep accessibility, type safety, and responsiveness in mind.
4. Validate with the relevant build/test command after meaningful changes.

## Build and verification
- Run `pnpm build` after substantive changes.
- If the shell cannot find `pnpm`, use the workspace package manager runtime available in the environment before reporting a build issue.

## Examples of tasks this agent should handle
- Create or edit landing page sections.
- Update service, project, career, contact, and quote pages.
- Add reusable content blocks and centralize shared site data.
- Refine copy, navigation, CTA flows, metadata, and layout consistency.
- Adjust styling tokens, transitions, responsive behavior, and component composition.
