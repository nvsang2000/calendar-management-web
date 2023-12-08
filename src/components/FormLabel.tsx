import { Row, message } from 'antd'
import Svg from './Svg'

interface propsFrmLabel {
  label: string
  require?: boolean
  valueCoppy?: string
  iconCoppy?: boolean
  valueDirect?: string
  iconDirect?: boolean
  className?: any
}

export default function FormLabel({
  label = '',
  valueCoppy = '',
  valueDirect = '',
  require = false,
  iconCoppy = false,
  iconDirect = false,
  className,
}: propsFrmLabel) {
  return (
    <>
      <Row className={className}>
        <div
          className={
            'base-form-label mb-[6px] text-[14px] sm:text-[14pxpx] md:text-[14px] lg:text-[16px] xl:text-[16px]'
          }
        >
          {label}
          {require && (
            <span className={'text-[color:var(--light-red)]'}>*</span>
          )}
        </div>
        {iconCoppy && (
          <Svg
            name={'ic_copy'}
            width={24}
            height={24}
            className={'opacity-80 cursor-pointer ml-[10px]'}
            onClick={() => {
              navigator.clipboard.writeText(valueCoppy)
              message.open({
                type: 'success',
                content: `Copyed ${label}`,
              })
            }}
          />
        )}
        {iconDirect && (
          <a
            target="_blank"
            className={'text-[color:var(--text-color)]'}
            href={valueDirect}
          >
            <Svg
              name={'ic_direct'}
              width={16}
              height={16}
              className={'opacity-80 cursor-pointer ml-[10px]'}
            />
          </a>
        )}
      </Row>
    </>
  )
}
