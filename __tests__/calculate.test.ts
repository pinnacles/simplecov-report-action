import {expect, test} from '@jest/globals'
import {CoverageReport} from '../src/type'
import path from 'path'
import calculateToJson from '../src/calculate'

describe('test calculateToJson', () => {
  test('+20 % increase', () => {
    const baseRefCoverageJson = require(path.resolve('dummy_coverage/baseBranch.json')).metrics as CoverageReport
    const headRefCoverageJson = require(path.resolve('dummy_coverage/increaseCoverage.json')).metrics as CoverageReport
    const json = calculateToJson(headRefCoverageJson, baseRefCoverageJson)
    const expectJson = {
      covered_percent: '80.4%',
      coverage_diff: '+20%',
      coverage_diff_as_number: 20.000000000000007,
      status: ':white_check_mark:',
      groups: {
        Controllers: {
          covered_percent: '57.6%',
          coverage_diff: '+5%',
          status: ':white_check_mark:'
        },
        Channels: {
          covered_percent: '100%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Models: {
          covered_percent: '62.5%',
          coverage_diff: '+5%',
          status: ':white_check_mark:'
        },
        Mailers: {
          covered_percent: '40.7%',
          coverage_diff: '+5%',
          status: ':white_check_mark:'
        },
        Helpers: {
          covered_percent: '56.6%',
          coverage_diff: '+5%',
          status: ':white_check_mark:'
        },
        Jobs: {
          covered_percent: '100%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Libraries: {
          covered_percent: '49.9%',
          coverage_diff: '+5%',
          status: ':white_check_mark:'
        },
        Lib: {
          covered_percent: '44.9%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Entities: {
          covered_percent: '92.7%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Facades: {
          covered_percent: '38.7%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Policies: {
          covered_percent: '50.7%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Ungrouped: {
          covered_percent: '48.1%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        }
      }
    }
    expect(json).toEqual(expectJson)
  })

  test('-10 % decrease', () => {
    const baseRefCoverageJson = require(path.resolve('dummy_coverage/baseBranch.json')).metrics as CoverageReport
    const headRefCoverageJson = require(path.resolve('dummy_coverage/decreaseCoverage.json')).metrics as CoverageReport
    const json = calculateToJson(headRefCoverageJson, baseRefCoverageJson)
    const expectJson = {
      covered_percent: '50.4%',
      coverage_diff: '-10%',
      coverage_diff_as_number: -10,
      status: ':x:',
      groups: {
        Controllers: {covered_percent: '42.6%', coverage_diff: '-10%', status: ':x:'},
        Channels: {
          covered_percent: '100%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Models: {
          covered_percent: '57.5%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Mailers: {
          covered_percent: '35.7%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Helpers: {
          covered_percent: '51.6%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Jobs: {
          covered_percent: '100%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Libraries: {
          covered_percent: '44.9%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Lib: {
          covered_percent: '44.9%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Entities: {
          covered_percent: '92.7%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Facades: {
          covered_percent: '38.7%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Policies: {
          covered_percent: '50.7%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        },
        Ungrouped: {
          covered_percent: '48.1%',
          coverage_diff: '0',
          status: ':white_check_mark:'
        }
      }
    }
    expect(json).toEqual(expectJson)
  })
})
