import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin, Button, Card, Tabs } from 'antd';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined
} from '@ant-design/icons';
import api from '../utils/api';
import './VirtualTourViewer.css';

const { TabPane } = Tabs;

const VirtualTourViewer = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const viewerRef = useRef(null);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [viewStartTime] = useState(Date.now());

  useEffect(() => {
    fetchTour();
    return () => {
      // Track view duration when component unmounts
      const duration = Math.round((Date.now() - viewStartTime) / 1000);
      if (tourId) {
        api.post(`/virtual-tours/${tourId}/view`, { duration });
      }
    };
  }, [tourId]);

  const fetchTour = async () => {
    try {
      const response = await api.get(`/virtual-tours/${tourId}`);
      if (response.data.success) {
        setTour(response.data.data);
        setCurrentScene(response.data.data.default_scene || 0);
        setIsAutoRotate(response.data.data.auto_rotate);
      }
    } catch (error) {
      message.error('Failed to load virtual tour');
      console.error('Error fetching virtual tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const goToScene = (index) => {
    if (tour && index >= 0 && index < tour.panorama_images.length) {
      setCurrentScene(index);
    }
  };

  const nextScene = () => {
    if (tour && currentScene < tour.panorama_images.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const previousScene = () => {
    if (tour && currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  const handleClose = () => {
    if (tour?.property_id) {
      navigate(`/properties/${tour.property_id}`);
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="virtual-tour-loading">
        <Spin size="large" tip="Loading virtual tour..." />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="virtual-tour-error">
        <Card>
          <h2>Virtual Tour Not Found</h2>
          <Button type="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const currentPanorama = tour.panorama_images[currentScene];

  return (
    <div className="virtual-tour-viewer" ref={viewerRef}>
      {/* Header */}
      <div className="virtual-tour-header">
        <div className="tour-info">
          <h2>{tour.title}</h2>
          {tour.description && <p>{tour.description}</p>}
        </div>
        <div className="tour-controls">
          {tour.show_controls && (
            <>
              <Button
                icon={isAutoRotate ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                type="text"
                style={{ color: '#fff' }}
              >
                {isAutoRotate ? 'Pause' : 'Auto Rotate'}
              </Button>
              {tour.allow_fullscreen && (
                <Button
                  icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                  onClick={toggleFullscreen}
                  type="text"
                  style={{ color: '#fff' }}
                />
              )}
            </>
          )}
          <Button
            icon={<CloseOutlined />}
            onClick={handleClose}
            type="text"
            style={{ color: '#fff' }}
          />
        </div>
      </div>

      {/* Main Viewer */}
      <div className="tour-main-viewer">
        {tour.tour_type === '360_image' && currentPanorama ? (
          <div className="panorama-viewer">
            {/* Simple 360° image viewer - In production, use Pannellum or similar library */}
            <img
              src={currentPanorama.url}
              alt={currentPanorama.title || 'Panorama'}
              className="panorama-image"
            />
            <div className="panorama-overlay">
              <h3>{currentPanorama.title}</h3>
            </div>
          </div>
        ) : tour.tour_type === 'matterport' || tour.tour_type === 'custom' ? (
          <div className="external-tour">
            <iframe
              src={tour.tour_url}
              title={tour.title}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="tour-placeholder">
            <p>Unsupported tour type</p>
          </div>
        )}

        {/* Navigation Controls */}
        {tour.panorama_images && tour.panorama_images.length > 1 && (
          <div className="scene-navigation">
            <Button
              icon={<LeftOutlined />}
              onClick={previousScene}
              disabled={currentScene === 0}
              size="large"
              shape="circle"
              className="nav-button prev"
            />
            <div className="scene-indicator">
              {currentScene + 1} / {tour.panorama_images.length}
            </div>
            <Button
              icon={<RightOutlined />}
              onClick={nextScene}
              disabled={currentScene === tour.panorama_images.length - 1}
              size="large"
              shape="circle"
              className="nav-button next"
            />
          </div>
        )}
      </div>

      {/* Scene Thumbnails */}
      {tour.panorama_images && tour.panorama_images.length > 1 && (
        <div className="tour-thumbnails">
          <Tabs activeKey={currentScene.toString()} onChange={(key) => goToScene(parseInt(key))}>
            {tour.panorama_images.map((scene, index) => (
              <TabPane
                tab={
                  <div className="thumbnail-tab">
                    <img src={scene.url} alt={scene.title || `Scene ${index + 1}`} />
                    <span>{scene.title || `Scene ${index + 1}`}</span>
                  </div>
                }
                key={index.toString()}
              />
            ))}
          </Tabs>
        </div>
      )}

      {/* Instructions */}
      <div className="tour-instructions">
        <p>Click and drag to look around • Use arrow keys to navigate between scenes</p>
      </div>
    </div>
  );
};

export default VirtualTourViewer;
