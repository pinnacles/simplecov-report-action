import path from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'
import report from './report'
import {CoverageReport} from './type'

async function run(): Promise<void> {
  try {
    if (core.getInput('event_name') !== 'pull_request' && core.getInput('event_name') !== 'push') {
      core.warning('event_name is not allowed except pull_request or push')
      return
    }

    if (core.getInput('event_name') === 'pull_request' && !github.context.issue.number) {
      core.warning('Cannot find the PR id.')
      return
    }

    if (core.getInput('event_name') === 'push' && !core.getInput('pr_number')) {
      core.warning('Cannot find the PR id.')
      return
    }

    const failedThreshold: number = Number.parseInt(core.getInput('failedThreshold'), 10)
    core.debug(`failedThreshold ${failedThreshold}`)

    const resultPath: string = core.getInput('resultPath')
    core.debug(`resultPath ${resultPath}`)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const json = require(path.resolve(process.env.GITHUB_WORKSPACE!, resultPath)).metrics as CoverageReport
    await report(json)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
