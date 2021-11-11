# Voice Ecommerce Demo

Fashion-themed voice ecommerce demo

## Requirements

- node v12.16.1
- pnpm 5.1.5
- speechly "CLI API Client"

## Configuration

- Install speechly API token:

```
speechly config add --name ecomprod --apikey <API Token> [--host api|staging.speechly.com]
```

- Setup `.env` using `.env.example` as a template.

```
cp .env.example .env
```

- Original data goes in `data/original/data.jsonl` (available after running `make` in fashion-ecommerce-api project)
- Product images go in `public/images`
- Voice aliases and display names go in `data/filter-config.csv`

## Available Scripts

### `pnpm install`

### `pnpm run preprocess`

- Source:
  - `data/original/data.jsonl`
  - `data/filter-config.csv` (generated if doesn't exist)
- Generates:
  - Updates `data/filter-config.csv` with new keywords
  - SAL lookups in `voice-configuration/[colors|category|brand|...].csv`
  - Frontend filter configuration in `src/generated/filters.json`
  - Frontend product inventory in `src/data/products.json` (for non-backend filtering)

### `pnpm run train`

Uses `speechly deploy` to send training data in `voice-configuration`

### `pnpm run status`

Uses `speechly describe` to show training status and any errors with the config.

### `pnpm start`

Run app with dev server.

### `pnpm build`

### `pnpm run deploy`

Uses `rsync` to transfer files to web server root specified by `.env` variable `REACT_APP__DEPLOY_DESTINATION_URI`.

### `pnpm run serve`

Run express server (currently serves app from build folder).

```
REACT_APP__DEPLOY_DESTINATION_URI="www@my-site.com:\~www/Sites/fashion"
```

## Installation
```
pnpm install
pnpm start
```

## Running

```
# Add aliases and disable/enable products and brands by (un)checking isActive here:
open data/filter-config.csv
pnpm run preprocess
pnpm run train
pnpm status
# Wait until training completed
pnpm start
```

## Building the app with a custom inventory

```
rm data/filter-config.csv
code data/original/data.jsonl
pnpm run preprocess
```
