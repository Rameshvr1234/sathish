import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Empty, Spin, Rate, Tag, message, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  HeartOutlined,
  HeartFilled,
  ThunderboltOutlined,
  ReloadOutlined,
  LikeOutlined,
  DislikeOutlined
} from '@ant-design/icons';
import api from '../utils/api';
import './AIRecommendations.css';

const AIRecommendations = ({ limit = 6, showRefresh = true }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get('/ai-recommendations', {
        params: { limit, refresh: refresh ? 'true' : 'false' }
      });

      if (response.data.success) {
        setRecommendations(response.data.data);

        // Track recommendations shown
        response.data.data.forEach(rec => {
          if (!rec.shown_at) {
            api.post(`/ai-recommendations/${rec.id}/track-shown`);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      if (error.response?.status !== 401) {
        message.error('Failed to load recommendations');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePropertyClick = async (recommendation) => {
    // Track click
    try {
      await api.post(`/ai-recommendations/${recommendation.id}/track-click`);
    } catch (error) {
      console.error('Error tracking click:', error);
    }

    navigate(`/properties/${recommendation.property_id}`);
  };

  const handleFeedback = async (recommendationId, isRelevant) => {
    try {
      await api.post(`/ai-recommendations/${recommendationId}/feedback`, {
        is_relevant: isRelevant
      });

      message.success(
        isRelevant
          ? 'Thanks! We\'ll show you more properties like this.'
          : 'Thanks for the feedback. We\'ll improve your recommendations.'
      );

      // Remove from UI if marked as not relevant
      if (!isRelevant) {
        setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      message.error('Failed to submit feedback');
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#52c41a';
    if (score >= 0.6) return '#1890ff';
    if (score >= 0.4) return '#faad14';
    return '#ff4d4f';
  };

  const getScoreLabel = (score) => {
    if (score >= 0.9) return 'Perfect Match';
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Great Match';
    if (score >= 0.4) return 'Good Match';
    return 'Match';
  };

  if (loading) {
    return (
      <div className="ai-recommendations-loading">
        <Spin size="large" tip="Generating personalized recommendations..." />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="ai-recommendations-empty">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <p>No recommendations available yet</p>
              <p style={{ fontSize: '14px', color: '#888' }}>
                Start browsing properties to get personalized recommendations!
              </p>
            </div>
          }
        >
          <Button type="primary" onClick={() => navigate('/properties')}>
            Browse Properties
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="ai-recommendations">
      <div className="recommendations-header">
        <div className="header-left">
          <ThunderboltOutlined className="ai-icon" />
          <div>
            <h2>AI Recommendations</h2>
            <p>Properties personalized just for you based on your preferences</p>
          </div>
        </div>
        {showRefresh && (
          <Button
            icon={<ReloadOutlined spin={refreshing} />}
            onClick={() => fetchRecommendations(true)}
            loading={refreshing}
          >
            Refresh
          </Button>
        )}
      </div>

      <Row gutter={[16, 16]}>
        {recommendations.map((rec) => {
          const property = rec.property;
          const score = parseFloat(rec.score);

          return (
            <Col xs={24} sm={12} lg={8} key={rec.id}>
              <Card
                hoverable
                className="recommendation-card"
                cover={
                  <div
                    className="property-image"
                    onClick={() => handlePropertyClick(rec)}
                    style={{
                      backgroundImage: `url(${property.images?.[0]?.url || '/placeholder-property.jpg'})`,
                      cursor: 'pointer'
                    }}
                  >
                    <div className="match-score" style={{ background: getScoreColor(score) }}>
                      <span className="score-value">{Math.round(score * 100)}%</span>
                      <span className="score-label">{getScoreLabel(score)}</span>
                    </div>
                  </div>
                }
              >
                <div className="property-info">
                  <h3
                    className="property-title"
                    onClick={() => handlePropertyClick(rec)}
                    style={{ cursor: 'pointer' }}
                  >
                    {property.title}
                  </h3>

                  <div className="property-details">
                    <div className="price">
                      {formatPrice(property.price)}
                      {property.listing_type === 'rent' && <span>/month</span>}
                    </div>

                    <div className="property-specs">
                      {property.bedrooms && <span>{property.bedrooms} BHK</span>}
                      {property.area && <span>{property.area} sqft</span>}
                      <span className="location">{property.location}, {property.city}</span>
                    </div>
                  </div>

                  <div className="recommendation-reason">
                    <Tag color="blue">Why this property?</Tag>
                    <p>{rec.reason}</p>
                  </div>

                  <div className="property-tags">
                    {property.property_type && (
                      <Tag>{property.property_type.replace('_', ' ')}</Tag>
                    )}
                    {property.listing_type && (
                      <Tag color="green">For {property.listing_type}</Tag>
                    )}
                    {property.is_featured && (
                      <Tag color="gold">Featured</Tag>
                    )}
                  </div>

                  <div className="recommendation-actions">
                    <Button
                      type="primary"
                      onClick={() => handlePropertyClick(rec)}
                      block
                    >
                      View Details
                    </Button>

                    <div className="feedback-buttons">
                      <Tooltip title="This is relevant">
                        <Button
                          icon={<LikeOutlined />}
                          onClick={() => handleFeedback(rec.id, true)}
                          size="small"
                          type="text"
                        />
                      </Tooltip>
                      <Tooltip title="Not interested">
                        <Button
                          icon={<DislikeOutlined />}
                          onClick={() => handleFeedback(rec.id, false)}
                          size="small"
                          type="text"
                          danger
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default AIRecommendations;
