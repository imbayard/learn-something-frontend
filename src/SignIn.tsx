import React, { useState } from 'react'
import './SignIn.css'
import { useNavigate } from 'react-router-dom'
import { notification } from 'antd'
import { container } from './lib/container'
import { LoaderButton } from './components/Loader'
import { UserContextModel } from './App'

export default function LogIn({
  handleGlobalUserInfoChange,
  triggerRefresh,
}: {
  handleGlobalUserInfoChange: (info: UserContextModel) => void
  triggerRefresh: () => Promise<void>
}) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setIsLoading] = useState(false)

  const [isSettingNew, setIsSettingNew] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >(undefined)
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  )
  const [name, setName] = useState('')
  const [cognitoUser, setCognitoUser] = useState(null)

  const schema =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/

  async function handleSubmit() {
    setIsLoading(true)

    container.auth
      .signIn(email, password)
      .then((response) => {
        if (
          response.challengeName &&
          response.challengeName === 'NEW_PASSWORD_REQUIRED'
        ) {
          const { requiredAttributes } = response.challengeParam
          console.log(requiredAttributes)
          setCognitoUser(response)
          setIsLoading(false)
          setIsSettingNew(true)
        } else {
          handleGlobalUserInfoChange({
            userId: response.attributes.sub,
            email: response.attributes.email,
            name: response.attributes.given_name,
          })
        }
      })
      .then(() => {
        notification.success({
          message: 'Successfully logged in!',
          description: 'Redirecting you in a few moments.',
          placement: 'topRight',
          duration: 1.5,
          onClose: () => {
            triggerRefresh()
          },
        })
      })
      .catch((err) => {
        console.log(err)
        notification.error({
          message: 'Error',
          description: 'Error logging in user',
          placement: 'topRight',
          duration: 1.5,
        })
        setIsLoading(false)
      })
  }

  const handlePasswordChange = (newPassword: string) => {
    setNewPassword(newPassword)

    if (!schema.test(newPassword)) {
      setPasswordError(
        'Password must be at least 8 characters long, contains at least one lowercase letter, at least one uppercase letter, at least one digit, at least one symbol, and has no spaces.'
      )
    } else {
      setPasswordError(undefined)
    }
  }

  const handleConfirmPasswordChange = (newConfirmPassword: string) => {
    setConfirmNewPassword(newConfirmPassword)

    if (newConfirmPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match.')
    } else {
      setConfirmPasswordError(undefined)
    }
  }

  const handleNewPasswordSubmit = async () => {
    setIsLoading(true)
    console.log(confirmPasswordError, passwordError)
    if (confirmPasswordError || passwordError) {
      notification.error({
        message: 'Error',
        description: confirmPasswordError || passwordError,
        placement: 'topRight',
        duration: 2,
      })
      setIsLoading(false)
    } else {
      console.log('Submitting new password for', name)
      try {
        const user = await container.auth.completeNewPassword(
          cognitoUser,
          newPassword,
          {
            given_name: name,
          }
        )
        handleGlobalUserInfoChange({
          userId: user.attributes.sub,
          email: user.attributes.email,
          name: user.attributes.given_name,
        })
        navigate('/')
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Error updating password',
          placement: 'topRight',
          duration: 1.5,
        })
        setIsLoading(false)
      }
    }
  }

  return !isSettingNew ? (
    <div>
      <form className="sign-on-form">
        <h1>Log In</h1>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {password && email ? (
          <LoaderButton
            message="Logging in..."
            buttonText="Log In"
            handleSubmit={() => handleSubmit()}
            isLoading={loading}
          />
        ) : (
          <></>
        )}
      </form>
    </div>
  ) : (
    <div>
      <form className="sign-on-form">
        <h1>Welcome!</h1>
        <label htmlFor="newPassword">Updated Password</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => handlePasswordChange(e.target.value)}
          required
        />
        <label htmlFor="confirmNewPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          required
        />
        <label htmlFor="user_name">Name</label>
        <input
          type="text"
          id="user_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <LoaderButton
          message="Updating..."
          buttonText="Update"
          handleSubmit={() => handleNewPasswordSubmit()}
          isLoading={loading}
        />
      </form>
    </div>
  )
}
