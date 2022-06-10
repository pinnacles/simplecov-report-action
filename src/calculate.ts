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

export default function calculateToJson(headBranchToJson: CoverageReport, currentToJson: CoverageReport): Result {
  const headBranchToGroupJson = headBranchToJson.groups
  const currentToGroupJson = currentToJson.groups
  const covered_percent = currentToJson.covered_percent
  const coverage_diff = currentToJson.covered_percent - headBranchToJson.covered_percent
  const status = coverage_diff < 0 ? ':x:' : ':white_check_mark:'

  const json: Result = {
    covered_percent: `${orgRound(covered_percent, 10)}%`,
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
    if (!headBranchCoverage) {
      json.groups[key].covered_percent = `${orgRound(coverage.covered_percent, 10)}%`
      json.groups[key].coverage_diff = '0'
      json.groups[key].status = ':white_check_mark:'
      continue
    }
    const coveredDiff = orgRound(coverage.covered_percent - headBranchCoverage.covered_percent, 10)
    json.groups[key].covered_percent = `${orgRound(coverage.covered_percent, 10)}%`
    if (headBranchCoverage.covered_percent === coverage.covered_percent) {
      json.groups[key].coverage_diff = '0'
      json.groups[key].status = ':white_check_mark:'
    } else if (headBranchCoverage.covered_percent < coverage.covered_percent) {
      json.groups[key].coverage_diff = `+${coveredDiff}%`
      json.groups[key].status = ':white_check_mark:'
    } else {
      json.groups[key].coverage_diff = `${coveredDiff}%`
      json.groups[key].status = ':x:'
    }
  }
  return json
}
