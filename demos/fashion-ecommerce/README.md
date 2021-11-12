# Voice Ecommerce Demo

Fashion-themed voice ecommerce demo.

## Requirements

- node v12.16.1+
- pnpm 5.1.5
- Speechly CLI tool for deploying the Speechly config. [See the installation docs.](https://docs.speechly.com/dev-tools/command-line-client/?platform=macos)

## Installing and running
```
pnpm install
pnpm start
```

## Installing and running in the Rush monorepo
```
rush update
rush build
rushx start
```

## Available Scripts

### `pnpm install`

### `pnpm run preprocess`

Updates the GUI and Speechly configs

- Sources:
  - `data/original/data.jsonl` - Contains the product inventory and attributes
  - `data/filter-config.csv` - Controls product and attribute visibility in app and contains synonyms.

- Generated:
  - Updates `data/filter-config.csv` with new keywords. Generated if doesn't exist.
  - SAL lookups in `config/[colors|category|brand|...].csv`
  - Frontend filter configuration in `src/generated/filters.json`
  - Frontend product inventory in `public/data_sample/products.json` (for non-backend filtering)

### `pnpm run train`

Uses `speechly deploy` to send training data in `voice-configuration`

### `pnpm run status`

Uses `speechly describe` to show training status and any errors with the config.

### `pnpm start`

Run app with dev server.

### `pnpm build`

### `pnpm run deploy`

Uses `rsync` to transfer files to web server root specified by `.env` variable `REACT_APP__DEPLOY_DESTINATION_URI`.

## Changing the vocabulary

```
# Add speechly API token if not done so already
speechly config add --name ecomprod --apikey <API Token> [--host api|staging.speechly.com]

# Edit synonyms (aliases) and disable/enable products and brands by (un)checking isActive here:
open data/filter-config.csv

# Update GUI and Speechly configs
pnpm run preprocess
pnpm run train
# Check if training has completed - if not, wait and rerun the command
pnpm status

# Try that the changes work
pnpm start
```

## Building the app with a custom inventory

```
# Remove stale entries from filter-config; will be recreated by pnpm preprocess
rm data/filter-config.csv

# Place custom data here
code data/original/data.jsonl
pnpm run preprocess

# Change USE_SERVER_SIDE_FILTERING to false to use public/data_sample/products.json as inventory
code src/components/Inventory.tsx

# Check out updated config file
cat data/filter-config.csv

# Check out generated files
cat src/generated/filters.json
cat public/data_sample/products.json
ls config

# Try the app with custom inventory
pnpm start
```
