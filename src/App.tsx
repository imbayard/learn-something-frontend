import React, { useState, createContext, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import SignIn from './SignIn'
import { container } from './lib/container'
import Header from './components/Header'
import { LearnSomething } from './learn-something/LearnSomething'

import './App.css'
import { LearnSomethingNodeComponent } from './components/LearnSomethingNode'

export const UserContext = createContext({
  userId: '',
  email: '',
  name: '',
  handleLogout: async () => {},
})

export interface UserContextModel {
  userId: string
  email: string
  name: string
  handleLogout?: () => Promise<void>
}

export default function App() {
  const [userInfo, setGlobalUserInfo] = useState({
    userId: '',
    email: '',
    name: '',
    handleLogout,
  })

  async function handleLogout() {
    await container.auth.signOut()
    setGlobalUserInfo({ userId: '', email: '', name: '', handleLogout })
    handleGlobalUserInfoChange({
      userId: '',
      email: '',
      name: '',
      handleLogout,
    })
    setIsAuthenticated(false)
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    fetchUserDescriptors()
  }, [])

  async function fetchUserDescriptors() {
    const info = loadUserInfoFromLocalStorage()
  }

  function saveUserInfoToLocalStorage(info: UserContextModel) {
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  function loadUserInfoFromLocalStorage() {
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedUserInfo) {
      const userInfo = JSON.parse(savedUserInfo)
      setGlobalUserInfo({ ...userInfo, handleLogout })
      setIsAuthenticated(userInfo.userId !== '')
      return userInfo
    }
  }

  function handleGlobalUserInfoChange(info: UserContextModel) {
    setGlobalUserInfo({
      userId: info.userId,
      email: info.email,
      name: info.name,
      handleLogout,
    })
    setIsAuthenticated(info.userId !== '')
    saveUserInfoToLocalStorage(info)
  }

  return (
    <UserContext.Provider value={userInfo}>
      <Router>
        <div className="App">
          <Header />
          <div className="app-body">
            {isAuthenticated ? (
              <LearnSomething email={userInfo.email} />
            ) : (
              <></>
            )}
            <Routes>
              {isAuthenticated ? (
                <Route
                  path="/:id"
                  element={
                    <LearnSomethingNodeComponent email={userInfo.email} />
                  }
                />
              ) : (
                <>
                  <Route
                    path="/*"
                    element={
                      <SignIn
                        handleGlobalUserInfoChange={handleGlobalUserInfoChange}
                        triggerRefresh={() => fetchUserDescriptors()}
                      />
                    }
                  />
                </>
              )}
            </Routes>
          </div>
        </div>
      </Router>
    </UserContext.Provider>
  )
}
