// Output the results of the coverage report of the head branch compared to the results of the coverage report of the current commit

import {Result, CoverageReport} from './type'

const orgRound = (value: number, base: number): number => {
  return Math.round(value * base) / base
}

export default function calculateToJson(
  headRefCoverageJson: CoverageReport,
  baseRefCoverageJson: CoverageReport
): Result {
  const baseBranchToGroupJson = baseRefCoverageJson.groups
  const headBranchToGroupJson = headRefCoverageJson.groups
  const baseBranchCoveredPercent = orgRound(baseRefCoverageJson.covered_percent, 10)
  const headBranchCoveredPercent = orgRound(headRefCoverageJson.covered_percent, 10)
  const coverageDiff = orgRound(headBranchCoveredPercent - baseBranchCoveredPercent, 10)
  const status = coverageDiff < 0 ? ':x:' : ':white_check_mark:'

  const json: Result = {
    covered_percent: `${headBranchCoveredPercent}%`,
    coverage_diff: coverageDiff,
    degraded: false,
    status,
    groups: {}
  }

  const keys = Object.keys(headBranchToGroupJson)
  for (const key of keys) {
    const headBranchCoverage = headBranchToGroupJson[key]
    json.groups[key] = {
      covered_percent: '',
      coverage_diff: '',
      status: ''
    }
    const headCoveragePercent = orgRound(headBranchCoverage.covered_percent, 10)
    const baseBranchCoverage = baseBranchToGroupJson[key]
    if (!baseBranchCoverage) {
      json.groups[key].covered_percent = `${headCoveragePercent}%`
      json.groups[key].coverage_diff = '0'
      json.groups[key].status = ':white_check_mark:'
      continue
    }
    const baseCoveragePercent = orgRound(baseBranchCoverage.covered_percent, 10)
    const coveredDiff = orgRound(headCoveragePercent - baseCoveragePercent, 10)
    json.groups[key].covered_percent = `${headCoveragePercent}%`
    if (baseCoveragePercent === headCoveragePercent) {
      json.groups[key].coverage_diff = '0'
      json.groups[key].status = ':white_check_mark:'
    } else if (baseCoveragePercent < headCoveragePercent) {
      json.groups[key].coverage_diff = `+${coveredDiff}%`
      json.groups[key].status = ':white_check_mark:'
    } else {
      json.groups[key].coverage_diff = `${coveredDiff}%`
      json.groups[key].status = ':x:'
      if (headCoveragePercent - baseCoveragePercent < -0.2) {
        json.degraded = true
      }
    }
  }
  return json
}
