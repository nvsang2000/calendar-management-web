import { createContext, useState } from 'react'
import { updateSettingApi } from '~/services/apis'

interface SettingInterface {
  settings: {
    [key: string]: string
  }
  setSettings: (value: any) => void
  updateSettings: (value: any) => void
}

type DefaultSettingInterface = SettingInterface

export const SettingsContext = createContext({} as DefaultSettingInterface)

export const SettingsProvider = ({ children }: { children?: JSX.Element }) => {
  const [settings, setSettings] = useState({})

  const updateSettings = async (value: any) => {
    try {
      const result = await updateSettingApi({
        settings: JSON.stringify(value || {}),
      })

      setSettings(result.data)
      return
    } catch (e: any) {
      console.log(e.message)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
