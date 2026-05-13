# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Behavioral Guidelines

Source: [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md). Biases toward caution over speed — for trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If 200 lines could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When changes create orphans, remove imports/variables/functions that YOUR changes made unused. Don't remove pre-existing dead code unless asked.

Test: every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan with verify-steps per step. Strong success criteria let you loop independently; weak criteria ("make it work") require constant clarification.

**Working if:** fewer unnecessary changes in diffs, fewer rewrites from overcomplication, clarifying questions before implementation rather than after mistakes.

---

## Project Overview

Static academic personal website for Mattia D'Urso, deployed via GitHub Pages at `mattiadurso.github.io`. No build system, package manager, or server-side code — everything is plain HTML/CSS/JS pushed directly to GitHub.

## Deployment

Changes go live automatically after pushing to `master`. No build step needed. The `CNAME` file configures the custom domain.

## Site Structure

Two independent sections with separate styling conventions:

**Main personal page** (`index.html` + `stylesheet.css`):
- Table-based layout (Jon Barron template), Lato font loaded inline from Google Fonts
- Publications are `<tr>` rows inside `index.html`; commented-out rows are papers in progress (EPO, TerraSky) that will be uncommented when published
- Images live in `imgs/<project-name>/`

**SANDesc project page** (`sandesc/index.html`):
- Uses Bulma CSS framework with carousel/slider components
- Static assets under `sandesc/static/` (css, js, images, videos, pdfs)
- Many `TODO` meta tags in the `<head>` remain unfilled (og:description, twitter handles, citation authors, etc.)

## Adding a New Paper to the Main Page

Copy an existing `<tr>` block in `index.html` (e.g., the SANDesc entry around line 195), update the image path, arXiv link, author spans, venue `<em>`, and description `<p>`. Add the thumbnail image to `imgs/<project-name>/`.

## Adding a New Project Page

Use `sandesc/` as a template. Create a new subdirectory, copy the `static/` assets, and update `sandesc/index.html` content (title, abstract, BibTeX, carousel images/videos). Fill in all `TODO` meta tags in the `<head>` for SEO.
