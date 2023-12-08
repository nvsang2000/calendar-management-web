import React from 'react'
import { Alert, AlertProps } from 'antd'

interface propsType {
  message: string
  type: AlertProps['type']
}
const AlertMessage = ({ message, type }: propsType) => {
  return (
    <div className="alert-message">
      <Alert message={message} type={type} />
    </div>
  )
}

export default AlertMessage
