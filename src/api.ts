import axios from 'axios'

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || 'prod'

const host =
  ENVIRONMENT === 'prod'
    ? process.env.REACT_APP_EC2_URL
    : 'http://localhost:443'

const withCredentials = ENVIRONMENT === 'prod' ? true : false

const URLS = {}

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
