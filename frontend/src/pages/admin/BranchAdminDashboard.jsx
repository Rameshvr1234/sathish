import { Card, Row, Col, Statistic } from 'antd'

const BranchAdminDashboard = () => {
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Branch Admin Dashboard</h1>
      <Row gutter={[16, 16]} style={{ marginTop: '30px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Pending Approvals" value={5} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Properties" value={45} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="New Leads" value={12} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Revenue" value={125000} prefix="₹" />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default BranchAdminDashboard
