import { useContext } from 'react'
import { SettingsContext } from '~/contexts/settings'

export default function useSettings() {
  const context = useContext(SettingsContext)
  return context
}
