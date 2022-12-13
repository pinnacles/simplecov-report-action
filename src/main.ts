import path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'
import report from './report'
import {CoverageReport} from './type'

async function run(): Promise<void> {
  try {
    core.debug(`${JSON.stringify(github)}`)
    if (!github.context.issue.number) {
      core.warning('Cannot find the PR id.')
      return
    }
    const pullRequestId = github.context.issue.number
    core.debug(`pullRequestId ${pullRequestId}`)

    const failedThreshold: number = Number.parseInt(core.getInput('failedThreshold'), 10)
    core.debug(`failedThreshold ${failedThreshold}`)

    const headRefCoveragePath: string = core.getInput('headRefCoveragePath')
    core.debug(`headRefCoveragePath ${headRefCoveragePath}`)

    const baseRefCoveragePath: string = core.getInput('baseRefCoveragePath')
    core.debug(`baseRefCoveragePath ${baseRefCoveragePath}`)

    core.debug(`path.resolve headRefCoverageJson ${path.resolve('./', headRefCoveragePath)}`)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const headRefCoverageJson = require(path.resolve('./', headRefCoveragePath)).metrics as CoverageReport
    core.debug(`read headRefCoverageJson`)

    core.debug(`path.resolve baseRefCoverageJson ${path.resolve('./', baseRefCoveragePath)}`)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const baseRefCoverageJson = require(path.resolve('./', baseRefCoveragePath)).metrics as CoverageReport
    core.debug(`read baseRefCoverageJson`)

    await report(pullRequestId, headRefCoverageJson, baseRefCoverageJson)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
