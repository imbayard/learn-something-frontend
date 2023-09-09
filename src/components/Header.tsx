import React, { useContext } from 'react'
import './Header.css'
import MainTile from './MainTile'
import { UserContext } from '../App'
import { LoaderButton } from './Loader'

const Header = () => {
  const { name, handleLogout } = useContext(UserContext)

  async function handleUserLogOut() {
    await handleLogout()
  }
  return (
    <header className="app-header">
      <MainTile title={name} page="/" isHeader={true} />
      <LoaderButton
        buttonText="Log Out"
        isLoading={false}
        message=""
        handleSubmit={() => handleUserLogOut()}
      />
    </header>
  )
}

export default Header
