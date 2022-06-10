import * as core from '@actions/core'
import * as github from '@actions/github'
import JSZip from 'jszip'
import postComment from './comment'
import markdownContent from './markdownContent'
import {CoverageReport} from './type'
import {getArtifactFromListArtifacts, getArtifactFromListWorkflowRunArtifacts, downloadArtifact} from './artifacts'
import calculateToJson from './calculate'

const isNullish = (value: unknown): value is null | undefined => {
  return value === null || value === undefined
}

const makeArrowEmoji = (coverage_diff: number): string => {
  if (coverage_diff === 0) return ''
  if (coverage_diff < 0) return ':arrow_down:'
  return ':arrow_up:'
}

const makePullRequestId = (): number => {
  if (core.getInput('event_name') === 'pull_request') {
    return github.context.issue.number
  }
  return Number(core.getInput('pr_number'))
}

export default async function report(currentToJson: CoverageReport): Promise<void> {
  const pullRequestId = makePullRequestId()
  if (!pullRequestId) {
    core.warning('Cannot find the PR id.')
    return
  }

  const per_page = 100

  const artifact = await getArtifactFromListArtifacts(
    core.getInput('token', {required: true}),
    github.context.repo.owner,
    github.context.repo.repo,
    core.getInput('head_branch'),
    per_page
  )

  const artifact2 = await getArtifactFromListWorkflowRunArtifacts(
    core.getInput('token', {required: true}),
    github.context.repo.owner,
    github.context.repo.repo,
    artifact
  )

  if (isNullish(artifact2) || isNullish(artifact2.workflow_run) || isNullish(artifact2.workflow_run.id)) {
    core.warning('Head branch does not exist')
    return
  }

  const archive_format = 'zip'
  const artifact_id = artifact2.id
  const head_sha = artifact2.workflow_run.head_sha

  const data = await downloadArtifact(
    core.getInput('token', {required: true}),
    github.context.repo.owner,
    github.context.repo.repo,
    artifact_id,
    archive_format
  )

  const zip = new JSZip()
  const res = await zip.loadAsync(new Uint8Array(data.data))
  const text = res.file('coverage.json')?.async('string')
  const content = await text
  if (content === undefined) {
    core.warning('The contents of coverage.json do not exist')
    return
  }
  const headBranchToJson = JSON.parse(content).metrics

  const arrowEmoji = makeArrowEmoji(currentToJson.covered_percent - headBranchToJson.covered_percent)

  const json = calculateToJson(headBranchToJson, currentToJson)
  await postComment({
    token: core.getInput('token', {required: true}),
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: pullRequestId,
    body: markdownContent(json, core.getInput('head_branch'), head_sha, arrowEmoji, pullRequestId)
  })
}
