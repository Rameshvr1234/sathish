import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, Button, Typography, Input, Statistic } from 'antd'
import { SearchOutlined, SafetyOutlined, FileProtectOutlined, ToolOutlined, DollarOutlined } from '@ant-design/icons'
import { fetchProperties } from '../redux/slices/propertySlice'

const { Title, Paragraph } = Typography
const { Search } = Input

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { properties } = useSelector((state) => state.property)

  useEffect(() => {
    dispatch(fetchProperties({ page: 1, limit: 6 }))
  }, [dispatch])

  const services = [
    {
      icon: <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: 'Survey Services',
      description: 'Digital, Land, DTCP Plot, House, Commercial & Industrial surveys',
      path: '/services/survey',
    },
    {
      icon: <FileProtectOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: 'Legal Services',
      description: 'Documentation, Legal Advice, Sale & Gift Deed assistance',
      path: '/services/legal',
    },
    {
      icon: <ToolOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
      title: 'Construction',
      description: '2D/3D Plans, Elevation, Vastu, Interior Design & Construction',
      path: '/services/construction',
    },
    {
      icon: <DollarOutlined style={{ fontSize: '48px', color: '#f5222d' }} />,
      title: 'Finance',
      description: 'EMI Calculator, Bank Tie-ups, Home & Plot Loans',
      path: '/services/finance',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '100px 20px',
          textAlign: 'center',
        }}
      >
        <Title level={1} style={{ color: 'white', marginBottom: '20px' }}>
          Find Your Dream Property
        </Title>
        <Paragraph style={{ fontSize: '18px', color: 'white', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Browse verified properties with SV certification. Your trusted partner in real estate.
        </Paragraph>
        <Search
          placeholder="Search properties by location..."
          enterButton={<SearchOutlined />}
          size="large"
          style={{ maxWidth: '600px' }}
          onSearch={(value) => navigate(`/properties?search=${value}`)}
        />
      </div>

      {/* Stats Section */}
      <div className="container" style={{ padding: '60px 20px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={8}>
            <Card style={{ textAlign: 'center' }}>
              <Statistic title="Properties Listed" value={1234} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ textAlign: 'center' }}>
              <Statistic title="SV Verified" value={567} suffix="+" />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ textAlign: 'center' }}>
              <Statistic title="Happy Customers" value={890} suffix="+" />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Services Section */}
      <div style={{ background: '#f5f5f5', padding: '60px 20px' }}>
        <div className="container">
          <Title level={2} style={{ textAlign: 'center', marginBottom: '50px' }}>
            Our Services
          </Title>
          <Row gutter={[32, 32]}>
            {services.map((service, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  hoverable
                  style={{ textAlign: 'center', height: '100%' }}
                  onClick={() => navigate(service.path)}
                >
                  <div style={{ marginBottom: '20px' }}>{service.icon}</div>
                  <Title level={4}>{service.title}</Title>
                  <Paragraph>{service.description}</Paragraph>
                  <Button type="primary">Learn More</Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="container" style={{ padding: '60px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Title level={2}>Featured Properties</Title>
          <Button type="link" onClick={() => navigate('/properties')}>
            View All →
          </Button>
        </div>
        <Row gutter={[24, 24]}>
          {properties.slice(0, 6).map((property) => (
            <Col xs={24} sm={12} md={8} key={property.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={property.title}
                    src={property.images?.[0]?.image_url || '/placeholder.jpg'}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
                onClick={() => navigate(`/properties/${property.id}`)}
              >
                {property.sv_verified && (
                  <div className="sv-verified-badge" style={{ marginBottom: '10px' }}>
                    ✓ SV Verified
                  </div>
                )}
                <Card.Meta
                  title={property.title}
                  description={
                    <>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff', marginTop: '10px' }}>
                        ₹{(property.price / 100000).toFixed(2)}L
                      </div>
                      <div style={{ marginTop: '8px', color: '#8c8c8c' }}>
                        {property.area} {property.area_unit} • {property.location}
                      </div>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Section */}
      <div
        style={{
          background: '#1890ff',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <Title level={2} style={{ color: 'white' }}>
          Ready to Find Your Property?
        </Title>
        <Paragraph style={{ fontSize: '16px', color: 'white', marginBottom: '30px' }}>
          Join thousands of satisfied customers who found their dream property with us
        </Paragraph>
        <Button size="large" type="default" onClick={() => navigate('/properties')}>
          Browse Properties
        </Button>
      </div>
    </div>
  )
}

export default Home
