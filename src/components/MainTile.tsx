import React from 'react'
import { useNavigate } from 'react-router-dom'
import './MainTile.css'

const MainTile = ({
  title,
  page,
  isHeader,
}: {
  title: string
  page: string
  isHeader?: boolean
}) => {
  const navigate = useNavigate()

  const handleNavigation = () => {
    navigate(page)
  }

  return (
    <div
      className={`main-tile${isHeader ? '-header' : ''}`}
      onClick={handleNavigation}
    >
      {title}
    </div>
  )
}

export default MainTile
