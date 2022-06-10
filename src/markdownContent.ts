import {markdownTable} from 'markdown-table'
import {Result} from './type'
import {encryptSha256} from './utils'

export default function markdownContent(
  result: Result,
  head_branch: string,
  head_sha: string | undefined,
  arrowEmoji: string,
  pullRequestId: number
): string {
  const digestMessage = encryptSha256(String(pullRequestId))
  return `## Coverage Report
merging this pull request into **${head_branch}** will increase coverage by **${result.coverage_diff}** ${arrowEmoji}
${markdownTableContent(result, head_sha)}

<!-- ${digestMessage} -->
`
}

function markdownTableContent(result: Result, head_sha: string | undefined): string {
  const headSha = head_sha === undefined ? 'Diff' : `Diff(${head_sha})`

  const list = [
    ['Group Files', 'Covered', headSha, ''],
    ['**Total**', `**${result.covered_percent}**`, `**${result.coverage_diff}**`, result.status]
  ]
  if (result.groups) {
    const groups = result.groups
    const keys = Object.keys(groups)
    const last_i = keys.length
    for (let i = 0; i < last_i; i++) {
      const key = keys[i]
      const covered_percent = groups[key].covered_percent
      const coverage_diff = groups[key].coverage_diff
      const status = groups[key].status
      list.push([key, covered_percent, coverage_diff, status])
    }
  }
  return markdownTable(list)
}
