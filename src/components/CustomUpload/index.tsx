/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from 'react'
import { Upload, Button, Modal } from 'antd'
import {
  UploadOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { uploadImage } from '~/services/apis'
import { useSetState } from 'react-use'
import { getBase64 } from '~/helpers'
import type { RcFile } from 'antd/es/upload'

interface UploadProps {
  value?: any
  onChange?: (values: any) => void
  description?: string
  type?: string
  disabled?: boolean
  multiple?: boolean
  accept?: any
}

export default function CustomUpload({
  value,
  onChange,
  description = '',
  type = 'image', //image, file
  //disabled = false,
  multiple = false,
  accept = '.png, .jpg, .jpeg, .jfif',
}: UploadProps) {
  const [preview, setPreview] = useSetState({ visible: false, image: '' })
  const [loading, setLoading] = useState(false)
  const uploading = useRef(false)
  const uploadRef = useRef<any>(null)

  const getFileList = () => {
    if (!value) {
      return []
    }

    return Array.isArray(value)
      ? value
          ?.filter((file) => file !== undefined)
          .map((file) => ({ uid: file, name: file, url: file }))
      : [{ uid: value, name: value, url: value }]

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const handleUpload = (_: any, fileList: any) => {
    if (uploading.current) {
      return
    }

    uploading.current = true

    setLoading(true)
    return new Promise((resolve, reject) => {
      Promise.all(
        fileList?.map(async (file: any) => {
          const action = uploadImage
          return action(file)
            .then((data) => {
              return data?.url
            })
            .catch((err) => {
              reject(err)
            })
            .finally(() => setLoading(false))
        }),
      ).then((files) => {
        if (files?.[0]) {
          const newValues = multiple ? [...(value || []), ...files] : files?.[0]
          onChange && onChange(newValues)
          uploading.current = false
          resolve(newValues)
        }
      })
    })
  }

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    if (type === 'image') {
      setPreview({ visible: true, image: file.url || file.preview })
      return
    }

    return window.open(file.url, '_blank', 'noopener,noreferrer')
  }

  const handleRemove = (file: any) => {
    const newValues = multiple
      ? value.filter((url: string) => url !== file?.url)
      : null
    onChange && onChange(newValues)
  }

  const UploadButton = () => {
    return <div>{loading ? <LoadingOutlined /> : <PlusOutlined />}</div>
  }

  return (
    <>
      <Upload
        fileList={getFileList()}
        listType={type === 'image' ? 'picture-card' : 'text'}
        beforeUpload={handleUpload}
        onPreview={handlePreview}
        multiple={multiple}
        onRemove={(file) => handleRemove(file)}
        {...(accept && { accept })}
      >
        {type === 'image' ? (
          multiple ? (
            <UploadButton />
          ) : getFileList().length === 0 ? (
            <UploadButton />
          ) : null
        ) : (
          <div>
            <Button
              loading={loading}
              onClick={() => uploadRef.current?.click()}
              icon={<UploadOutlined />}
              style={{ marginTop: 6 }}
            >
              Upload File
            </Button>
            <div style={{ paddingTop: 4 }}>{description}</div>
          </div>
        )}
      </Upload>
      <Modal
        open={preview.visible}
        title={'image'}
        footer={null}
        onCancel={() => setPreview({ visible: false, image: '' })}
      >
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={preview.image}
        />
      </Modal>
    </>
  )
}
