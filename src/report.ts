import * as core from '@actions/core'
import * as github from '@actions/github'
import postComment from './comment'
import markdownContent from './markdownContent'
import {CoverageReport} from './type'
import calculateToJson from './calculate'

const makeArrowEmoji = (coverage_diff: number): string => {
  if (coverage_diff === 0) return ''
  if (coverage_diff < 0) return ':arrow_down:'
  return ':arrow_up:'
}

export default async function report(
  pullRequestId: number,
  headRefCoverageJson: CoverageReport,
  baseRefCoverageJson: CoverageReport
): Promise<void> {
  const arrowEmoji = makeArrowEmoji(headRefCoverageJson.covered_percent - baseRefCoverageJson.covered_percent)
  const json = calculateToJson(headRefCoverageJson, baseRefCoverageJson)
  if (json.coverage_diff_as_number < 0) {
    await postComment({
      token: core.getInput('token', {required: true}),
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: pullRequestId,
      body: markdownContent(json, core.getInput('baseBranch'), github.context.sha, arrowEmoji, pullRequestId)
    })
    throw 'detect decreasing test coverage'
  }
}
