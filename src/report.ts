import * as core from '@actions/core'
import * as github from '@actions/github'
import postComment from './comment'
import markdownContent from './markdownContent'
import {CoverageReport} from './type'
import calculateToJson from './calculate'

export default async function report(
  pullRequestId: number,
  headRefCoverageJson: CoverageReport,
  baseRefCoverageJson: CoverageReport
): Promise<void> {
  const json = calculateToJson(headRefCoverageJson, baseRefCoverageJson)
  if (json.degraded) {
    await postComment({
      token: core.getInput('token', {required: true}),
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: pullRequestId,
      body: markdownContent(json, github.context.sha, pullRequestId)
    })
    throw new Error('detect decreasing test coverage')
  }
}
