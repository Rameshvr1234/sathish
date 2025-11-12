import { useEffect, useState } from 'react';
import SEOHead from './SEOHead';
import api from '../../utils/api';
import PropTypes from 'prop-types';

/**
 * Property-specific SEO Component
 * Automatically fetches and applies SEO meta tags and structured data for property pages
 */
const PropertySEO = ({ property, propertyId }) => {
  const [seoData, setSeoData] = useState(null);
  const [structuredData, setStructuredData] = useState(null);

  useEffect(() => {
    if (property) {
      generateSEOFromProperty(property);
    } else if (propertyId) {
      fetchSEOData(propertyId);
    }
  }, [property, propertyId]);

  const fetchSEOData = async (id) => {
    try {
      const [metaResponse, structuredResponse] = await Promise.all([
        api.get(`/seo/meta-tags/${id}`),
        api.get(`/seo/structured-data/${id}`)
      ]);

      if (metaResponse.data.success) {
        setSeoData(metaResponse.data.data);
      }

      if (structuredResponse.data.success) {
        setStructuredData(structuredResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    }
  };

  const generateSEOFromProperty = (prop) => {
    const baseUrl = import.meta.env.VITE_APP_URL || 'https://yourdomain.com';

    // Format price
    const priceFormatted = prop.price >= 10000000
      ? `₹${(prop.price / 10000000).toFixed(2)} Cr`
      : `₹${(prop.price / 100000).toFixed(2)} Lakhs`;

    // Create title
    const title = `${prop.bedrooms ? prop.bedrooms + ' BHK ' : ''}${prop.property_type?.replace('_', ' ')} for ${prop.listing_type} in ${prop.location}, ${prop.city} - ${priceFormatted}`;

    // Create description
    const description = `${prop.title}. ${prop.bedrooms ? prop.bedrooms + ' Bedrooms, ' : ''}${prop.bathrooms ? prop.bathrooms + ' Bathrooms. ' : ''}${prop.area ? prop.area + ' sqft. ' : ''}${priceFormatted}. ${prop.description?.substring(0, 100)}... Contact now for more details.`;

    // Keywords
    const keywords = [
      prop.property_type,
      prop.listing_type,
      prop.location,
      prop.city,
      prop.bedrooms ? `${prop.bedrooms} BHK` : '',
      'real estate',
      'property',
      prop.listing_type === 'sale' ? 'buy property' : 'rent property',
      prop.furnishing_status,
      ...((prop.amenities || []).slice(0, 5))
    ].filter(Boolean).join(', ');

    const seo = {
      title,
      description: description.substring(0, 160),
      keywords,
      image: prop.images?.[0]?.url || `${baseUrl}/default-property.jpg`,
      url: `${baseUrl}/properties/${prop.id}`,
      type: 'website',
      publishedTime: prop.created_at,
      modifiedTime: prop.updated_at
    };

    setSeoData(seo);

    // Generate structured data
    const structured = {
      property: {
        "@context": "https://schema.org",
        "@type": prop.listing_type === 'sale' ? "SingleFamilyResidence" : "Accommodation",
        "name": prop.title,
        "description": prop.description,
        "url": `${baseUrl}/properties/${prop.id}`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": prop.address,
          "addressLocality": prop.location,
          "addressRegion": prop.city,
          "addressCountry": "IN",
          "postalCode": prop.pincode
        },
        "geo": prop.latitude && prop.longitude ? {
          "@type": "GeoCoordinates",
          "latitude": parseFloat(prop.latitude),
          "longitude": parseFloat(prop.longitude)
        } : undefined,
        "numberOfRooms": prop.bedrooms,
        "numberOfBathroomsTotal": prop.bathrooms,
        "floorSize": prop.area ? {
          "@type": "QuantitativeValue",
          "value": parseFloat(prop.area),
          "unitCode": prop.area_unit === 'sqft' ? "FTK" : "MTK"
        } : undefined,
        "image": prop.images?.map(img => img.url) || [],
        "offers": {
          "@type": "Offer",
          "price": parseFloat(prop.price),
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        "amenityFeature": (prop.amenities || []).map(amenity => ({
          "@type": "LocationFeatureSpecification",
          "name": amenity
        }))
      },
      breadcrumb: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Properties",
            "item": `${baseUrl}/properties`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": prop.city,
            "item": `${baseUrl}/properties?city=${prop.city}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": prop.title,
            "item": `${baseUrl}/properties/${prop.id}`
          }
        ]
      }
    };

    setStructuredData(structured);
  };

  if (!seoData) {
    return null;
  }

  return (
    <SEOHead
      title={seoData.title}
      description={seoData.description}
      keywords={seoData.keywords}
      image={seoData.image}
      url={seoData.url}
      type={seoData.type}
      publishedTime={seoData.publishedTime}
      modifiedTime={seoData.modifiedTime}
      structuredData={structuredData}
    />
  );
};

PropertySEO.propTypes = {
  property: PropTypes.object,
  propertyId: PropTypes.string
};

export default PropertySEO;
