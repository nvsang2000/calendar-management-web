import { Image } from 'antd'
import Head from 'next/head'

export default function Page403() {
  return (
    <>
      <Head>
        <title>403 Page</title>
      </Head>
      <div className={'rounded-[8px] bg-white p-[40px]'}>
        <div className="flex justify-center">
          <Image
            preview={false}
            src="/assets/img/error-403.png"
            alt="img-error-403"
          />
        </div>
      </div>
    </>
  )
}
