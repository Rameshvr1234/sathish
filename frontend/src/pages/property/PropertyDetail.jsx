import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Descriptions, Button, Result } from 'antd'
import { fetchProperty } from '../../redux/slices/propertySlice'

const PropertyDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { property, loading } = useSelector((state) => state.property)

  useEffect(() => {
    dispatch(fetchProperty(id))
  }, [dispatch, id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!property) {
    return <Result status="404" title="Property not found" />
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>{property.title}</h1>
      {property.sv_verified && (
        <div className="sv-verified-badge">✓ SV Verified</div>
      )}
      <Card>
        <Descriptions bordered>
          <Descriptions.Item label="Price">₹{(property.price / 100000).toFixed(2)}L</Descriptions.Item>
          <Descriptions.Item label="Area">{property.area} {property.area_unit}</Descriptions.Item>
          <Descriptions.Item label="Type">{property.property_type}</Descriptions.Item>
          <Descriptions.Item label="Location" span={3}>{property.location}, {property.city}</Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>{property.description}</Descriptions.Item>
        </Descriptions>
        <Button type="primary" size="large" style={{ marginTop: '20px' }}>
          Contact Owner
        </Button>
      </Card>
    </div>
  )
}

export default PropertyDetail
