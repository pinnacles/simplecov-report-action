type Groups = {
  [key: string]: {
    covered_percent: string
    coverage_diff: string
    status: string
  }
}

export type Result = {
  covered_percent: string
  coverage_diff: string
  degraded: boolean
  status: string
  groups: Groups
}

type CoverageGroups = {
  [key: string]: {
    covered_percent: number
    coverage_diff: number
    status: string
  }
}

export type CoverageReport = {
  covered_percent: number
  coverage_diff: number
  status: string
  groups: CoverageGroups
}
