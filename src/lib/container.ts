import { Amplify, Auth } from 'aws-amplify'
import awsmobile from '../aws-exports'

Amplify.configure(awsmobile)
export const container = {
  auth: Auth,
}
