# Nerve fork workspace

This repository is the user-owned fork `jamalkhaffaf/openclaw-nerve`.

- `origin`: https://github.com/jamalkhaffaf/openclaw-nerve.git
- `upstream`: https://github.com/daggerhashimoto/openclaw-nerve.git
- Default branch: `master`; push project changes to `origin`, not `upstream`.
- OpenClaw and Hermes share this checkout under the shared Projects root.
- This is a separate project from Cockpit. Do not repoint or restart the existing Cockpit/Nerve services as part of ordinary work here.
- Retain upstream licensing and attribution. Review upstream changes before merging them.

## Knowledge graph

Run `/graphify` from this repository root to rebuild the full code/documentation graph.
Generated artifacts live in ignored `graphify-out/`:

- `graph.json`: queryable knowledge graph
- `GRAPH_REPORT.md`: architecture/community report
- `graph.html`: interactive visualization

When the graph exists, start architecture exploration with `graphify query "your question"`.
For code-only incremental refreshes, use `graphify update .`; use the full `/graphify` workflow for documentation changes.
Generated graph artifacts are local, not included in GitHub code backup.

## Application development

See README.md and CONTRIBUTING.md for setup. Node.js 22+ is required.
Use `npm ci`, `npm run build`, `npm run lint`, and `npm test -- --run` as appropriate to changes.
Keep credentials and runtime state out of Git; `.env.example` is a template, not a live configuration.
