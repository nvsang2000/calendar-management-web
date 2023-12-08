import { useEffect, useState } from 'react'

export const useDevice = () => {
  const [windowWidth, setWindowWidth] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const isTablet = windowWidth < 1024
  const isMobile = windowWidth < 768

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    setWindowWidth(window.innerWidth)
    setWindowHeight(window.innerHeight)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    isMobile,
    isTablet,
    windowWidth,
    windowHeight,
  }
}
