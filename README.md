# DailySQL Static Website

This project scrapes SQL problem/solution data from:

https://www.dsfaisal.com/blog/sql/leetcode-sql-problem-solving

and renders it as a static React website.

## Scripts

- `npm run scrape` → fetches the source page and regenerates `src/assets/questions.json`
- `npm run dev` → starts the local development server
- `npm run build` → creates a production static build in `dist/`
- `npm run preview` → previews the production build locally
- `npm run lint` → runs ESLint checks

## Data Source Output

The generated dataset is stored in `src/assets/questions.json` and includes:

- article metadata
- list of scraped SQL problems
- solution SQL blocks for each problem

## Quick Start

1. `npm install`
2. `npm run scrape`
3. `npm run dev`
