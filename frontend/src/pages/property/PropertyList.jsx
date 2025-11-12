import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, Select, Slider, Checkbox, Button, Spin, Empty } from 'antd'
import { fetchProperties, fetchLocationsByRegion, setFilters } from '../../redux/slices/propertySlice'

const { Option } = Select

const PropertyList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { properties, loading, locations, filters } = useSelector((state) => state.property)
  const [budgetRange, setBudgetRange] = useState([500000, 10000000])

  const regions = [
    { value: 'coimbatore', label: 'Coimbatore (CBE)' },
    { value: 'salem', label: 'Salem' },
    { value: 'tirupur', label: 'Tirupur' },
  ]

  useEffect(() => {
    dispatch(fetchProperties(filters))
  }, [dispatch, filters])

  const handleRegionChange = (value) => {
    dispatch(setFilters({ region: value, location: '' }))
    if (value) {
      dispatch(fetchLocationsByRegion(value))
    }
  }

  const handleApplyFilters = () => {
    dispatch(setFilters({
      budgetMin: budgetRange[0],
      budgetMax: budgetRange[1],
    }))
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Browse Properties</h1>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6}>
          <div className="filter-section">
            <h3>Filters</h3>

            <div style={{ marginBottom: '20px' }}>
              <label><strong>Region</strong></label>
              <Select
                placeholder="Select Region"
                value={filters.region}
                onChange={handleRegionChange}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {regions.map(r => (
                  <Option key={r.value} value={r.value}>{r.label}</Option>
                ))}
              </Select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label><strong>Location</strong></label>
              <Select
                placeholder="Select Location"
                value={filters.location}
                onChange={(value) => dispatch(setFilters({ location: value }))}
                disabled={!filters.region}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {locations.map(loc => (
                  <Option key={loc.name} value={loc.name}>
                    {loc.name} ({loc.property_count})
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label><strong>Budget Range</strong></label>
              <Slider
                range
                min={500000}
                max={10000000}
                step={100000}
                value={budgetRange}
                onChange={setBudgetRange}
                style={{ marginTop: '20px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <span>₹{(budgetRange[0] / 100000).toFixed(0)}L</span>
                <span>₹{(budgetRange[1] / 100000).toFixed(0)}L</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Checkbox
                checked={filters.sv_verified}
                onChange={(e) => dispatch(setFilters({ sv_verified: e.target.checked }))}
              >
                SV Verified Only
              </Checkbox>
              <br />
              <Checkbox
                checked={filters.owner_only}
                onChange={(e) => dispatch(setFilters({ owner_only: e.target.checked }))}
                style={{ marginTop: '10px' }}
              >
                Owner Properties Only
              </Checkbox>
            </div>

            <Button type="primary" block onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </Col>

        <Col xs={24} lg={18}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
            </div>
          ) : properties.length === 0 ? (
            <Empty description="No properties found" />
          ) : (
            <Row gutter={[24, 24]}>
              {properties.map((property) => (
                <Col xs={24} sm={12} lg={8} key={property.id}>
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
          )}
        </Col>
      </Row>
    </div>
  )
}

export default PropertyList
