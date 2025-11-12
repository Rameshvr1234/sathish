import { Layout, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons'

const { Footer: AntFooter } = Layout

const Footer = () => {
  return (
    <AntFooter style={{ background: '#001529', color: '#fff', marginTop: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>PropertyPortal</h3>
            <p style={{ color: '#rgba(255,255,255,0.7)' }}>
              Your trusted partner in finding the perfect property
            </p>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <h4 style={{ color: '#fff', marginBottom: '20px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/properties" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Browse Properties
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/services/survey" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Survey Services
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/services/legal" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Legal Services
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/services/construction" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Construction
                </Link>
              </li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <h4 style={{ color: '#fff', marginBottom: '20px' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.7)' }}>
                Property Buying & Selling
              </li>
              <li style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.7)' }}>
                Survey Services
              </li>
              <li style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.7)' }}>
                Legal Documentation
              </li>
              <li style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.7)' }}>
                Finance Assistance
              </li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <h4 style={{ color: '#fff', marginBottom: '20px' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.7)' }}>
                <PhoneOutlined /> +91 1234567890
              </li>
              <li style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.7)' }}>
                <MailOutlined /> info@propertyportal.com
              </li>
              <li style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.7)' }}>
                <EnvironmentOutlined /> Coimbatore, Tamil Nadu
              </li>
            </ul>
          </Col>
        </Row>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: '40px',
            paddingTop: '20px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <p>&copy; 2025 PropertyPortal. All rights reserved.</p>
        </div>
      </div>
    </AntFooter>
  )
}

export default Footer
