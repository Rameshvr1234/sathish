import { Form, Input, Select, InputNumber, Button, Card } from 'antd'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createProperty } from '../../redux/slices/propertySlice'
import { toast } from 'react-toastify'

const { TextArea } = Input
const { Option } = Select

const CreateProperty = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    try {
      await dispatch(createProperty(values)).unwrap()
      toast.success('Property created successfully!')
      navigate('/my-properties')
    } catch (error) {
      toast.error('Error creating property')
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Card title="Create New Property">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="e.g., 3 BHK Apartment in RS Puram" />
          </Form.Item>

          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Describe your property..." />
          </Form.Item>

          <Form.Item label="Property Type" name="property_type" rules={[{ required: true }]}>
            <Select>
              <Option value="land">Land</Option>
              <Option value="dtcp_plot">DTCP Plot</Option>
              <Option value="house">House</Option>
              <Option value="commercial">Commercial</Option>
              <Option value="industrial">Industrial</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Price (₹)" name="price" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item label="Area" name="area" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item label="Region" name="region" rules={[{ required: true }]}>
            <Select>
              <Option value="coimbatore">Coimbatore</Option>
              <Option value="salem">Salem</Option>
              <Option value="tirupur">Tirupur</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Input placeholder="e.g., RS Puram" />
          </Form.Item>

          <Form.Item label="City" name="city" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Pincode" name="pincode" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large">
            Submit Property
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default CreateProperty
