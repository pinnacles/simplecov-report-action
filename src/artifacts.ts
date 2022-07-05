import {Octokit} from '@octokit/rest'
import {OctokitResponse} from '@octokit/types'

type Artifact =
  | {
      id: number
      node_id: string
      /** The name of the artifact. */
      name: string
      /** The size in bytes of the artifact. */
      size_in_bytes: number
      url: string
      archive_download_url: string
      /** Whether or not the artifact has expired. */
      expired: boolean
      created_at: string | null
      expires_at: string | null
      updated_at: string | null
      workflow_run?: {
        id?: number
        repository_id?: number
        head_repository_id?: number
        head_branch?: string
        head_sha?: string
      } | null
    }
  | undefined

// Use the list artifacts api to get the artifact matching the head branch
// However, if the artifact cannot be retrieved in one request, update the page and repeat twice more
// api: https://docs.github.com/en/rest/actions/artifacts#list-artifacts-for-a-repository
export const getArtifactFromListArtifacts = async (
  auth: string,
  owner: string,
  repo: string,
  head_branch: string,
  per_page: number
): Promise<Artifact> => {
  let page = 1
  let artifact: Artifact = undefined
  const octokit = new Octokit({auth})
  while (page <= 3) {
    const {data} = await octokit.rest.actions.listArtifactsForRepo({
      owner,
      repo,
      page,
      per_page
    })

    const listArtifacts = data.artifacts

    artifact = listArtifacts.find((tempArtifact: Artifact) => tempArtifact?.workflow_run?.head_branch == head_branch)
    if (artifact) break
    page++
  }
  return artifact
}

// Get the artifact that matches the 'coverage'
// api: https://docs.github.com/en/rest/actions/artifacts#list-workflow-run-artifacts
export const getArtifactFromListWorkflowRunArtifacts = async (
  auth: string,
  owner: string,
  repo: string,
  artifact: Artifact
): Promise<Artifact> => {
  const octokit = new Octokit({auth})

  if (isNullish(artifact) || isNullish(artifact.workflow_run) || isNullish(artifact.workflow_run.id)) {
    return artifact
  }

  const {data: data} = await octokit.rest.actions.listWorkflowRunArtifacts({
    owner,
    repo,
    run_id: artifact.workflow_run.id
  })

  return data.artifacts.find((tempArtifact: Artifact) => tempArtifact?.name == 'coverage')
}

const isNullish = (value: unknown): value is null | undefined => {
  return value === null || value === undefined
}

export const downloadArtifact = async (
  auth: string,
  owner: string,
  repo: string,
  artifact_id: number,
  archive_format: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<OctokitResponse<any, 302>> => {
  const octokit = new Octokit({auth})
  const data = await octokit.rest.actions.downloadArtifact({
    owner,
    repo,
    artifact_id,
    archive_format
  })

  return data
}
