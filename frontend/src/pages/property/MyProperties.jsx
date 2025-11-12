import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Table, Tag } from 'antd'
import { fetchMyProperties } from '../../redux/slices/propertySlice'

const MyProperties = () => {
  const dispatch = useDispatch()
  const { myProperties, loading } = useSelector((state) => state.property)

  useEffect(() => {
    dispatch(fetchMyProperties())
  }, [dispatch])

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `₹${(price / 100000).toFixed(2)}L` },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag>{status}</Tag> },
  ]

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Card title="My Properties">
        <Table dataSource={myProperties} columns={columns} loading={loading} rowKey="id" />
      </Card>
    </div>
  )
}

export default MyProperties
