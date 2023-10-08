import axios from 'axios'
import { LearnSomethingNode } from './model/learn-something'
import { LearnSomethingOpts } from './learn-something/LearnSomethingForm'

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || 'prod'

const host =
  ENVIRONMENT === 'prod'
    ? process.env.REACT_APP_EC2_URL
    : 'http://localhost:443'

const withCredentials = ENVIRONMENT === 'prod' ? true : false

const URLS = {
  fetchLearnSomethings: '/learn-something/fetch-all',
  createNewRoot: '/learn-something/create-root',
  deleteLearnSomething: '/learn-something/delete',
  fetchLearnSomethingById: '/learn-something/fetch-by-id',
}

export async function fetchLearnSomethings(
  email: string
): Promise<LearnSomethingNode[]> {
  const res = await makePost(URLS.fetchLearnSomethings, { email })
  console.log(JSON.stringify(res.data.learnSomethingTree))
  return (res.data.learnSomethingTree as LearnSomethingNode[]) || []
}

export async function createNewLearnSomethingRoot(opts: LearnSomethingOpts) {
  const res = await makePost(URLS.createNewRoot, opts)
  console.log(JSON.stringify(res.data))
  return res.data as LearnSomethingNode
}

export async function deleteLearnSomething(
  id: string,
  deleteChildren: boolean
) {
  const res = await makePost(URLS.deleteLearnSomething, { id, deleteChildren })
  console.log(`Delete was ${res.data ? 'Successful' : 'Unsuccessful'}`)
}

export async function fetchLearnSomethingById(id: string, email: string) {
  const res = await makePost(URLS.fetchLearnSomethingById, { id, email })
  if (res.data?.id && res.data.id === id) {
    return res.data as LearnSomethingNode
  } else {
    console.log('Fetch unsuccessful...')
    return undefined
  }
}

async function deleteRequest(url: string, body: any) {
  console.log(`Making request: ${JSON.stringify(body)}`)
  return await axios
    .delete(`${host}${url}`, {
      data: body,
      withCredentials,
      httpsAgent: {
        rejectUnauthorized: false,
      },
    })
    .then(function (response) {
      console.log(response)
      return response.data
    })
    .catch(function (error) {
      console.log(error)
      return error
    })
}

async function makePost(url: string, post_body: any) {
  console.log(`Making request: ${JSON.stringify(post_body)}`)
  return await axios
    .post(`${host}${url}`, post_body, {
      withCredentials,
      httpsAgent: {
        rejectUnauthorized: false,
      },
    })
    .then(function (response) {
      console.log(response)
      return response
    })
    .catch(function (error) {
      console.log(error)
      return error
    })
}

async function getRequest(url: string) {
  return await axios
    .get(url, {
      withCredentials,
      httpsAgent: {
        rejectUnauthorized: false,
      },
    })
    .then(function (response) {
      console.log(response)
      return response
    })
    .catch(function (error) {
      console.log(error)
      return error
    })
}
