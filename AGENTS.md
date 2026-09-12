# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

Keep all six portfolio chapters and their evidence available on mobile. At widths up to 700px, use touch-friendly scroll reveals, reading progress, and subtle portrait motion; preserve a complete static reading flow when reduced motion is requested.

Use the supplied still images for scroll-driven perspective turns across all six chapters, switching poses edge-on without crossfade ghosting. Keep the character in the central third; target visible head-to-foot height of five-sixths of the viewport, with one-twelfth above and below. Account for transparent padding and fit wide poses proportionally inside that third so limbs and adjacent text stay complete. Side content exits upward and the next chapter enters from below with a pronounced viewport-scale movement. Mobile retains its complete stacked reading flow with larger portraits and strong individual content reveals. This is an image effect, not true 3D; no generated video is required.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
