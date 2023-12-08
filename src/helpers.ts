import { RcFile } from 'antd/es/upload'
import { ImageProps } from 'next/image'
import { State } from 'swr'
import numeral from 'numeral'

export function localStorageProvider() {
  if (typeof window === 'undefined') {
    return new Map([]) as Map<string, State<any, any>>
  }

  const map: Map<string, State<any, any>> = new Map(
    JSON.parse(localStorage.getItem('app-cache') || '[]'),
  )

  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('app-cache', appCache)
  })

  return map
}

export const getBase64 = (file: RcFile) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = (error) => reject(error)
  })

export const imageLoader: any = ({ src, width, quality }: ImageProps) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

export const parseSafe = (str: string) => {
  try {
    const result = JSON.parse(str)

    return result
  } catch (e: any) {
    return undefined
  }
}

export const numberFormat = (value: any) => numeral(value).format('0,0[.]00')

export const formatPhoneNumber = (phoneNumber: any) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    const formatted = `(${match[1]}) ${match[2]}-${match[3]}`
    return formatted
  }
  return phoneNumber
}

export const convertDurationToTime = (duration: number): string => {
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

  const coverDay = days > 0 ? ` ${days} Day` : ''
  const coverHours = hours > 0 ? ` ${hours} Hour` : ''
  const coverMinutes = minutes > 0 ? ` ${minutes} Minute` : ''

  const totalProcessTime = coverDay + coverHours + coverMinutes
  return totalProcessTime
}

export const timeOneDay = 24 * 60 * 60 * 1000
