import { Button, Col, Row } from 'antd'
import { useRouter } from 'next/router'

const FromPage: React.FC = () => {
  const router = useRouter()
  return (
    <>
      <div className="mb-[20px] rounded-[8px] bg-white p-[20px]">
        <Row gutter={10} className={'mb-[8px]'}>
          <Col flex={1}>
            <div className={'text-[18px] font-medium'}>
              <span className={'mr-[10px] text-[color:var(--green)]'}></span>
              Form
            </div>
          </Col>
          <Col>
            <Button
              type={'primary'}
              onClick={() => router.push('/admin/forms/create')}
            >
              Create new
            </Button>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default FromPage

export async function getServerSideProps() {
  return {
    props: {
      pageKey: '(Forms)',
      requiredRoles: [],
    },
  }
}
