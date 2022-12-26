import {expect, test} from '@jest/globals'
import {CoverageReport} from '../src/type'
import markdownContent from '../src/markdownContent'
import path from 'path'
import calculateToJson from '../src/calculate'

test('test markdownContent', () => {
  const baseRefCoverageJson = require(path.resolve('dummy_coverage/baseBranch.json')).metrics as CoverageReport
  const currentToJson = require(path.resolve('dummy_coverage/increaseCoverage.json')).metrics as CoverageReport
  const json = calculateToJson(currentToJson, baseRefCoverageJson)

  const head_sha = 'xxx'
  const pullRequestId = 1111
  const result = `## Detect Coverage Degradation
カバレッジが 20% 下がりました。テストコードを確認してください。
| Group Files | Covered   | Diff(xxx) |                    |
| ----------- | --------- | --------- | ------------------ |
| **Total**   | **80.4%** | **+20%**  | :white_check_mark: |
| Controllers | 57.6%     | +5%       | :white_check_mark: |
| Channels    | 100%      | 0         | :white_check_mark: |
| Models      | 62.5%     | +5%       | :white_check_mark: |
| Mailers     | 40.7%     | +5%       | :white_check_mark: |
| Helpers     | 56.6%     | +5%       | :white_check_mark: |
| Jobs        | 100%      | 0         | :white_check_mark: |
| Libraries   | 49.9%     | +5%       | :white_check_mark: |
| Lib         | 44.9%     | 0         | :white_check_mark: |
| Entities    | 92.7%     | 0         | :white_check_mark: |
| Facades     | 38.7%     | 0         | :white_check_mark: |
| Policies    | 50.7%     | 0         | :white_check_mark: |
| Ungrouped   | 48.1%     | 0         | :white_check_mark: |

<!-- 0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c -->
`

  expect(result).toEqual(expect.stringContaining(markdownContent(json, head_sha, pullRequestId)))
})
