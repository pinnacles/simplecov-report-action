import {Octokit} from '@octokit/rest'
import type {RestEndpointMethodTypes} from '@octokit/plugin-rest-endpoint-methods'
import {encryptSha256} from './utils'

type GeneralOptions = {
  token: string
  owner: string
  repo: string
  issue_number: number
}

type PostCommentOptions = GeneralOptions & {
  body: string
}

type CreateCommentResponse = Promise<RestEndpointMethodTypes['issues']['createComment']['response']['data']>

type CreateCommentOptions = GeneralOptions & {
  body: string
}

const issues = (auth: string): Octokit['issues'] => {
  return new Octokit({auth}).issues
}

// Find text with SHA256-digested issue number in the comment
const findComment = async ({
  token,
  owner,
  repo,
  issue_number
}: GeneralOptions): Promise<{comment_id: number | undefined}> => {
  const firstLine = encryptSha256(String(issue_number))
  const {data: existingComments} = await issues(token).listComments({owner, repo, issue_number})
  const comment = existingComments.find(c => c.body?.match(firstLine))

  return {comment_id: comment ? comment.id : undefined}
}

const createComment = async ({
  token,
  owner,
  repo,
  issue_number,
  body
}: Readonly<CreateCommentOptions>): Promise<CreateCommentResponse> => {
  const response = await issues(token).createComment({owner, repo, issue_number, body})
  return response.data
}

export default async function postComment({
  token,
  owner,
  repo,
  issue_number,
  body
}: Readonly<PostCommentOptions>): Promise<void | CreateCommentResponse> {
  const {comment_id} = await findComment({token, owner, repo, issue_number})
  if (comment_id) {
    await issues(token).updateComment({owner, repo, comment_id, body})
    return
  }
  return createComment({token, owner, repo, issue_number, body})
}
