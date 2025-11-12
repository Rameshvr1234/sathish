import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Table, Tag } from 'antd'
import { fetchMyBookings } from '../../redux/slices/serviceSlice'

const MyBookings = () => {
  const dispatch = useDispatch()
  const { bookings, loading } = useSelector((state) => state.service)

  useEffect(() => {
    dispatch(fetchMyBookings())
  }, [dispatch])

  const columns = [
    { title: 'Service', dataIndex: 'service_type', key: 'service_type' },
    { title: 'Sub Type', dataIndex: 'service_sub_type', key: 'service_sub_type' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amt) => `₹${amt}` },
    { title: 'Status', dataIndex: 'booking_status', key: 'booking_status', render: (status) => <Tag>{status}</Tag> },
    { title: 'Payment', dataIndex: 'payment_status', key: 'payment_status', render: (status) => <Tag>{status}</Tag> },
  ]

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Card title="My Bookings">
        <Table dataSource={bookings} columns={columns} loading={loading} rowKey="id" />
      </Card>
    </div>
  )
}

export default MyBookings
