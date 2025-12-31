import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn) {
      navigate('/dashboard')
    } else {
      navigate('/portfolio')
    }
  }, [navigate])

  return null
}

export default Landing
