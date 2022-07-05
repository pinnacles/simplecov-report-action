# SimpleCov Report

A GitHub Action that report SimpleCov coverage.

![Demo](https://gyazo.com/aba83d5a6454f560e9e91d3b15f8d1d9.png)

## Usage:

The action works only with `pull_request` or `push` event.

### Inputs

- `token` - The GITHUB_TOKEN secret.
- `failedThreshold` - Failed threshold. (default: `90`)
- `resultPath` - Path to last_run json file. (default: `coverage/coverage.json`)
- `event_name` - pull_request or push. (default: `pull_request`)
- `pr_number` - Set pr_number if event_name is selected.
- `head_branch` - Compare head branch coverage results

## Example

```yaml
name: Tests
on:
  pull_request:

jobs:
  build:
    steps:
      - name: Test
        run: bundle exec rspec

      - name: SimpleCov Report
        uses: pinnacles/simplecov-report-action@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          event_name: pull_request
          head_branch: main
```
