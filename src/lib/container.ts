import { Amplify, Auth } from 'aws-amplify'
import awsmobile from '../aws-exports'

Amplify.configure(awsmobile)
const env = process.env
export const container = {
  auth: Auth,
  noapi: (env.REACT_APP_NOAPI || 'false') === 'true',
}
