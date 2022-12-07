// Output the results of the coverage report of the head branch compared to the results of the coverage report of the current commit

import {Result, CoverageReport} from './type'

const orgRound = (value: number, base: number): number => {
  return Math.round(value * base) / base
}

const coverageDiffText = (coverage_diff: number): string => {
  if (coverage_diff === 0) return '0'
  if (coverage_diff < 0) return `${orgRound(coverage_diff, 10)}%`
  return `+${orgRound(coverage_diff, 10)}%`
}

export default function calculateToJson(
  headRefCoverageJson: CoverageReport,
  baseRefCoverageJson: CoverageReport
): Result {
  const headBranchToGroupJson = baseRefCoverageJson.groups
  const currentToGroupJson = headRefCoverageJson.groups
  const current_covered_percent = orgRound(headRefCoverageJson.covered_percent, 10)
  const base_branch_covered_percent = orgRound(baseRefCoverageJson.covered_percent, 10)
  const coverage_diff = current_covered_percent - base_branch_covered_percent
  const status = coverage_diff < 0 ? ':x:' : ':white_check_mark:'

  const json: Result = {
    covered_percent: `${current_covered_percent}%`,
    coverage_diff: coverageDiffText(coverage_diff),
    status,
    groups: {}
  }

  const keys = Object.keys(currentToGroupJson)
  for (const key of keys) {
    const headBranchCoverage = headBranchToGroupJson[key]
    const coverage = currentToGroupJson[key]
    json.groups[key] = {
      covered_percent: '',
      coverage_diff: '',
      status: ''
    }
    const covered_percent = orgRound(coverage.covered_percent, 10)
    const head_coverage_percent = orgRound(headBranchCoverage.covered_percent, 10)
    if (!headBranchCoverage) {
      json.groups[key].covered_percent = `${covered_percent}%`
      json.groups[key].coverage_diff = '0'
      json.groups[key].status = ':white_check_mark:'
      continue
    }
    const coveredDiff = orgRound(covered_percent - head_coverage_percent, 10)
    json.groups[key].covered_percent = `${covered_percent}%`
    if (head_coverage_percent === covered_percent) {
      json.groups[key].coverage_diff = '0'
      json.groups[key].status = ':white_check_mark:'
    } else if (head_coverage_percent < covered_percent) {
      json.groups[key].coverage_diff = `+${coveredDiff}%`
      json.groups[key].status = ':white_check_mark:'
    } else {
      json.groups[key].coverage_diff = `${coveredDiff}%`
      json.groups[key].status = ':x:'
    }
  }
  return json
}
