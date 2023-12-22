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
        <div className={''}>
          <span
            className={
              'mb-[6px] text-[14px] text-black sm:text-[14pxpx] md:text-[14px] lg:text-[16px] xl:text-[16px]'
            }
          >
            {label}
          </span>
          {require && (
            <span className={'ml-[4px]'}>
              (<span className="text-[color:var(--light-red)]">Require</span>)
            </span>
          )}
        </div>
        {iconCoppy && (
          <Svg
            name={'ic_copy'}
            width={24}
            height={24}
            className={'ml-[10px] cursor-pointer opacity-80'}
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
            rel="noreferrer"
          >
            <Svg
              name={'ic_direct'}
              width={16}
              height={16}
              className={'ml-[10px] cursor-pointer opacity-80'}
            />
          </a>
        )}
      </Row>
    </>
  )
}
