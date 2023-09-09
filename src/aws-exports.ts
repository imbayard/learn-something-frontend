const env = process.env

const awsmobile = {
  aws_project_region: 'us-east-1',
  aws_cognito_identity_pool_id: env.REACT_APP_COGNITO_POOL_ID,
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: env.REACT_APP_USER_POOL_ID,
  aws_user_pools_web_client_id: env.REACT_APP_USER_POOL_WEBCLIENT_ID,
  oauth: {},
}

export default awsmobile
