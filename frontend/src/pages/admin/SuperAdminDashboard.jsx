import { Card, Row, Col, Statistic } from 'antd'

const SuperAdminDashboard = () => {
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Super Admin Dashboard</h1>
      <Row gutter={[16, 16]} style={{ marginTop: '30px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Properties" value={234} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Pending Super Approval" value={8} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="SV Verified" value={156} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Revenue" value={4567000} prefix="₹" />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SuperAdminDashboard
