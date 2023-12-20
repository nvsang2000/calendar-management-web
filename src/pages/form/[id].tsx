import { Button, Col, Form, Input, Row, Select } from 'antd'
import { useRouter } from 'next/router'
import { DatePicker, StaffSelect } from '~/components'

export default function FormViewPage() {
  const router = useRouter()
  const id = router.query.user + ''
  console.log(' router.query', router.query)
  return (
    <div className="  p-[40px]">
      <Row justify={'center'} align={'middle'} style={{ height: '300px' }}>
        {/* <Col span={24} style={{ textAlign: 'center' }}>
          <h2
            className={
              'lg-[36px] pt-[20px] text-[24px] font-semibold text-[#029147] sm:text-[26px] md:pt-[40px] md:text-[36px] xl:text-[36px]'
            }
          >
            Login
          </h2>
        </Col> */}
        <Col
          lg={14}
          xs={22}
          style={{ maxWidth: 512 }}
          className="border-[1px] border-black p-[20px]"
        >
          <Form layout="vertical" onFinish={() => console.log('heello')}>
            <Form.Item label="Chọn giờ" name="appointmentTime">
              <DatePicker showTime format="YYYY-MM-DD HH" className="!w-full" />
            </Form.Item>

            <Form.Item
              label="Chọn nhân viên"
              name="staff"
              rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
            >
              <StaffSelect />
            </Form.Item>

            <Form.Item
              label="Nhập email"
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input type="email" />
            </Form.Item>

            <Form.Item
              label="Nhập số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
              ]}
            >
              <Input type="tel" />
            </Form.Item>

            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Đặt lịch
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
