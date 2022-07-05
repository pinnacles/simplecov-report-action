import {expect, test} from '@jest/globals'
import {CoverageReport} from '../src/type'
import path from 'path'
import calculateToJson from '../src/calculate'

describe('test calculateToJson', () => {
  test('+20 % increase', () => {
    const headBranchToJson = require(path.resolve('dummy_coverage/headBranch.json')).metrics as CoverageReport
    const currentToJson = require(path.resolve('dummy_coverage/increaseCoverage.json')).metrics as CoverageReport
    const json = calculateToJson(headBranchToJson, currentToJson)
    const expectJson = {
      covered_percent: '80.4%',
      coverage_diff: '+20%',
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
    console.log(json)
    expect(json).toEqual(expectJson)
  })

  test('-10 % decrease', () => {
    const headBranchToJson = require(path.resolve('dummy_coverage/headBranch.json')).metrics as CoverageReport
    const currentToJson = require(path.resolve('dummy_coverage/decreaseCoverage.json')).metrics as CoverageReport
    const json = calculateToJson(headBranchToJson, currentToJson)
    const expectJson = {
      covered_percent: '50.4%',
      coverage_diff: '-10%',
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
    console.log(json)
    expect(json).toEqual(expectJson)
  })
})
