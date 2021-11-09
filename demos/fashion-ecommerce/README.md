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

## Setup, edit and test sample bash log
```
git clone git@github.com:speechly/fashion-ecommerce.git
git checkout release/v2

# Create configuration file .env with V2 Speechly App Id
cat > .env
REACT_APP__APP_TITLE="Ecommerce demo V2 - pr*0bc0"
REACT_APP__SPEECHLY_APP_ID="4d7fd32a-909b-45a0-93da-e313fda00bc0"
REACT_APP__SPEECHLY_LANGUAGE_CODE="en-US"
REACT_APP__FASHION_API_URL="https://ecom-fashion-demo-api.herokuapp.com"
REACT_APP__FASHION_CDN_URL="https://storage.googleapis.com/ecom-fashion-cdn"
REACT_APP__DEPLOY_STAGING_URI="www@myhost.com:~www/Sites/fashion"
# End with CTRL-D

pnpm install
pnpm start

# Add aliases and disable/enable products and brands by (un)checking isActive here:
open data/filter-config.csv
pnpm run preprocess
pnpm run train
pnpm status
# Wait until training completed
pnpm run dev
```

## Publishing a staging version to unix web server:

```
pnpm run staging
```
