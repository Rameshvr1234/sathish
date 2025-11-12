import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, Card, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '../../redux/slices/authSlice'

const { Title, Text } = Typography

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const onFinish = (values) => {
    dispatch(login(values))
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
        padding: '20px',
      }}
    >
      <Card style={{ width: '100%', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Login to your account</Text>
        </div>

        <Form name="login" onFinish={onFinish} size="large" layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>
              Don't have an account? <Link to="/register">Register now</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login
