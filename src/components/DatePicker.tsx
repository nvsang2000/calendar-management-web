import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs'
import generateDatePicker from 'antd/lib/date-picker/generatePicker'
import generateRangePicker from 'antd/lib/date-picker/generatePicker/generateRangePicker'

const DatePicker = generateDatePicker(dayjsGenerateConfig)
const RangePicker = generateRangePicker(dayjsGenerateConfig)

export { DatePicker, RangePicker }
