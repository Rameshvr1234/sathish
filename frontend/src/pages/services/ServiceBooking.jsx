import { useParams } from 'react-router-dom'
import { Card, Form, Input, Button, Select } from 'antd'
import { useDispatch } from 'react-redux'
import { bookSurvey, bookLegal, bookConstruction, submitFinanceEnquiry } from '../../redux/slices/serviceSlice'
import { toast } from 'react-toastify'

const { TextArea } = Input
const { Option } = Select

const ServiceBooking = () => {
  const { type } = useParams()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const serviceOptions = {
    survey: [
      { value: 'digital', label: 'Digital Survey - ₹5,000' },
      { value: 'land', label: 'Land Survey - ₹8,000' },
      { value: 'dtcp_plot', label: 'DTCP Plot Survey - ₹10,000' },
      { value: 'house', label: 'House Survey - ₹12,000' },
      { value: 'commercial', label: 'Commercial Survey - ₹15,000' },
      { value: 'industrial', label: 'Industrial Survey - ₹20,000' },
    ],
    legal: [
      { value: 'sale_deed', label: 'Sale Deed - ₹15,000' },
      { value: 'gift_deed', label: 'Gift Deed - ₹12,000' },
      { value: 'legal_advice', label: 'Legal Advice - ₹5,000' },
    ],
    construction: [
      { value: '2d_3d_plan', label: '2D/3D Plans - ₹25,000' },
      { value: '3d_elevation', label: '3D Elevation - ₹15,000' },
      { value: 'plan_approval', label: 'Plan Approval - ₹20,000' },
      { value: 'vastu', label: 'Vastu - ₹10,000' },
      { value: 'walkthrough', label: 'Walk-through - ₹18,000' },
      { value: 'interior', label: 'Interior Design - ₹50,000' },
      { value: 'construction', label: 'Building Construction - Quote Based' },
    ],
    finance: [
      { value: 'home_loan', label: 'Home Loan' },
      { value: 'plot_loan', label: 'Plot Loan' },
    ],
  }

  const onFinish = async (values) => {
    try {
      if (type === 'survey') {
        await dispatch(bookSurvey(values)).unwrap()
      } else if (type === 'legal') {
        await dispatch(bookLegal(values)).unwrap()
      } else if (type === 'construction') {
        await dispatch(bookConstruction(values)).unwrap()
      } else if (type === 'finance') {
        await dispatch(submitFinanceEnquiry(values)).unwrap()
      }
      toast.success('Booking submitted successfully!')
      form.resetFields()
    } catch (error) {
      toast.error('Error submitting booking')
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Card title={`Book ${type.charAt(0).toUpperCase() + type.slice(1)} Service`}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Service Type"
            name="service_sub_type"
            rules={[{ required: true, message: 'Please select a service' }]}
          >
            <Select placeholder="Select service">
              {serviceOptions[type]?.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Property Address"
            name="property_address"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} placeholder="Enter complete address" />
          </Form.Item>

          <Form.Item label="Additional Details" name="additional_details">
            <TextArea rows={4} placeholder="Any specific requirements..." />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large">
            Submit Booking
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default ServiceBooking
