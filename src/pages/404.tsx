import { Image } from 'antd'
import Head from 'next/head'

export default function Page404() {
  return (
    <>
      <Head>
        <title>404 Page</title>
      </Head>
      <div className={'rounded-[8px] bg-white p-[40px]'}>
        <div className="flex justify-center">
          <Image
            preview={false}
            src="/assets/img/error-404.png"
            alt="img-error-404"
          />
        </div>
      </div>
    </>
  )
}
