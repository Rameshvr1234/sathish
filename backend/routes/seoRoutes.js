const express = require('express');
const router = express.Router();
const { Property, Builder, Project } = require('../models');
const { Op } = require('sequelize');

// @route   GET /api/seo/sitemap.xml
// @desc    Generate XML sitemap for SEO
// @access  Public
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';

    // Get all active properties
    const properties = await Property.findAll({
      where: {
        status: 'approved',
        is_active: true
      },
      attributes: ['id', 'updated_at', 'city', 'location'],
      order: [['updated_at', 'DESC']],
      limit: 50000 // Google sitemap limit
    });

    // Get all builders
    const builders = await Builder.findAll({
      where: { is_active: true },
      attributes: ['id', 'updated_at'],
      limit: 10000
    });

    // Get all projects
    const projects = await Project.findAll({
      where: { is_active: true },
      attributes: ['id', 'updated_at'],
      limit: 10000
    });

    // Build sitemap XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add homepage
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += `    <changefreq>daily</changefreq>\n`;
    sitemap += `    <priority>1.0</priority>\n`;
    sitemap += `  </url>\n`;

    // Add static pages
    const staticPages = [
      { path: '/properties', priority: '0.9', changefreq: 'daily' },
      { path: '/builders', priority: '0.8', changefreq: 'weekly' },
      { path: '/projects', priority: '0.8', changefreq: 'weekly' },
      { path: '/services', priority: '0.7', changefreq: 'monthly' },
      { path: '/about', priority: '0.6', changefreq: 'monthly' },
      { path: '/contact', priority: '0.6', changefreq: 'monthly' }
    ];

    staticPages.forEach(page => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${page.path}</loc>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Add property pages
    properties.forEach(property => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/properties/${property.id}</loc>\n`;
      sitemap += `    <lastmod>${property.updated_at.toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.8</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Add builder pages
    builders.forEach(builder => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/builders/${builder.id}</loc>\n`;
      sitemap += `    <lastmod>${builder.updated_at.toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>monthly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Add project pages
    projects.forEach(project => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/projects/${project.id}</loc>\n`;
      sitemap += `    <lastmod>${project.updated_at.toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.75</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Add location-based pages
    const cities = ['Coimbatore', 'Salem', 'Tirupur'];
    const propertyTypes = ['apartment', 'independent_house', 'villa', 'plot'];

    cities.forEach(city => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/properties?city=${encodeURIComponent(city)}</loc>\n`;
      sitemap += `    <changefreq>daily</changefreq>\n`;
      sitemap += `    <priority>0.75</priority>\n`;
      sitemap += `  </url>\n`;

      propertyTypes.forEach(type => {
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/properties?city=${encodeURIComponent(city)}&type=${type}</loc>\n`;
        sitemap += `    <changefreq>daily</changefreq>\n`;
        sitemap += `    <priority>0.7</priority>\n`;
        sitemap += `  </url>\n`;
      });
    });

    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// @route   GET /api/seo/robots.txt
// @desc    Generate robots.txt for SEO
// @access  Public
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';

  let robotsTxt = `# Real Estate Portal - Robots.txt\n`;
  robotsTxt += `# Generated: ${new Date().toISOString()}\n\n`;

  robotsTxt += `User-agent: *\n`;
  robotsTxt += `Allow: /\n`;
  robotsTxt += `Disallow: /admin/\n`;
  robotsTxt += `Disallow: /api/\n`;
  robotsTxt += `Disallow: /profile/\n`;
  robotsTxt += `Disallow: /auth/\n`;
  robotsTxt += `Disallow: /dashboard/\n`;
  robotsTxt += `Disallow: /*/edit\n`;
  robotsTxt += `Disallow: /*/delete\n`;
  robotsTxt += `Disallow: /*?*sort=\n`;
  robotsTxt += `Disallow: /*?*page=\n\n`;

  robotsTxt += `# Sitemap location\n`;
  robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n\n`;

  robotsTxt += `# Crawl-delay for specific bots\n`;
  robotsTxt += `User-agent: Googlebot\n`;
  robotsTxt += `Crawl-delay: 0\n\n`;

  robotsTxt += `User-agent: Bingbot\n`;
  robotsTxt += `Crawl-delay: 1\n\n`;

  robotsTxt += `# Block bad bots\n`;
  robotsTxt += `User-agent: AhrefsBot\n`;
  robotsTxt += `User-agent: SemrushBot\n`;
  robotsTxt += `Disallow: /\n`;

  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// @route   GET /api/seo/structured-data/:propertyId
// @desc    Generate structured data (Schema.org) for property
// @access  Public
router.get('/structured-data/:propertyId', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.propertyId, {
      include: [
        { model: require('../models').User, as: 'owner', attributes: ['name', 'phone', 'email'] },
        { model: require('../models').PropertyImage, as: 'images', limit: 10 }
      ]
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';

    // Generate Schema.org structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": property.listing_type === 'sale' ? "SingleFamilyResidence" : "Accommodation",
      "name": property.title,
      "description": property.description,
      "url": `${baseUrl}/properties/${property.id}`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address,
        "addressLocality": property.location,
        "addressRegion": property.city,
        "addressCountry": "IN",
        "postalCode": property.pincode
      },
      "geo": property.latitude && property.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": parseFloat(property.latitude),
        "longitude": parseFloat(property.longitude)
      } : undefined,
      "numberOfRooms": property.bedrooms || undefined,
      "numberOfBathroomsTotal": property.bathrooms || undefined,
      "floorSize": property.area ? {
        "@type": "QuantitativeValue",
        "value": parseFloat(property.area),
        "unitCode": property.area_unit === 'sqft' ? "FTK" : "MTK"
      } : undefined,
      "image": property.images && property.images.length > 0
        ? property.images.map(img => img.url)
        : [],
      "offers": {
        "@type": "Offer",
        "price": parseFloat(property.price),
        "priceCurrency": "INR",
        "availability": property.status === 'approved' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "seller": {
          "@type": property.posted_by === 'builder' ? "Organization" : "Person",
          "name": property.owner?.name || "Property Owner",
          "telephone": property.owner?.phone || "",
          "email": property.owner?.email || ""
        }
      },
      "amenityFeature": property.amenities && Array.isArray(property.amenities)
        ? property.amenities.map(amenity => ({
            "@type": "LocationFeatureSpecification",
            "name": amenity
          }))
        : [],
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Property Type",
          "value": property.property_type
        },
        {
          "@type": "PropertyValue",
          "name": "Listing Type",
          "value": property.listing_type
        },
        {
          "@type": "PropertyValue",
          "name": "Furnishing Status",
          "value": property.furnishing_status
        },
        property.parking_count > 0 ? {
          "@type": "PropertyValue",
          "name": "Parking",
          "value": `${property.parking_count} ${property.parking_type}`
        } : null
      ].filter(Boolean),
      "datePosted": property.created_at.toISOString(),
      "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Add BreadcrumbList for better navigation
    const breadcrumbList = {
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
          "name": property.city,
          "item": `${baseUrl}/properties?city=${property.city}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": property.title,
          "item": `${baseUrl}/properties/${property.id}`
        }
      ]
    };

    res.json({
      success: true,
      data: {
        property: structuredData,
        breadcrumb: breadcrumbList
      }
    });
  } catch (error) {
    console.error('Error generating structured data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/seo/meta-tags/:propertyId
// @desc    Generate meta tags for property
// @access  Public
router.get('/meta-tags/:propertyId', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.propertyId, {
      include: [
        { model: require('../models').PropertyImage, as: 'images', limit: 1 }
      ]
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';
    const pageUrl = `${baseUrl}/properties/${property.id}`;

    // Format price for display
    const priceFormatted = property.price >= 10000000
      ? `₹${(property.price / 10000000).toFixed(2)} Cr`
      : `₹${(property.price / 100000).toFixed(2)} Lakhs`;

    // Create meta description
    const metaDescription = `${property.bedrooms ? property.bedrooms + ' BHK ' : ''}${property.property_type.replace('_', ' ')} for ${property.listing_type} in ${property.location}, ${property.city}. ${priceFormatted}. ${property.area ? property.area + ' sqft.' : ''} ${property.description.substring(0, 100)}...`;

    const metaTags = {
      // Basic meta tags
      title: `${property.title} - ${property.location}, ${property.city} | Real Estate Portal`,
      description: metaDescription.substring(0, 160),
      keywords: `${property.property_type}, ${property.listing_type}, ${property.location}, ${property.city}, ${property.bedrooms ? property.bedrooms + ' BHK' : ''}, real estate, property`,

      // Open Graph tags (Facebook, LinkedIn)
      ogTitle: property.title,
      ogDescription: metaDescription.substring(0, 200),
      ogUrl: pageUrl,
      ogType: 'website',
      ogImage: property.images && property.images[0] ? property.images[0].url : `${baseUrl}/default-property.jpg`,
      ogImageWidth: '1200',
      ogImageHeight: '630',
      ogSiteName: 'Real Estate Portal',
      ogLocale: 'en_IN',

      // Twitter Card tags
      twitterCard: 'summary_large_image',
      twitterTitle: property.title,
      twitterDescription: metaDescription.substring(0, 200),
      twitterImage: property.images && property.images[0] ? property.images[0].url : `${baseUrl}/default-property.jpg`,
      twitterSite: '@YourTwitterHandle',

      // Additional SEO tags
      canonical: pageUrl,
      robots: 'index, follow',
      author: 'Real Estate Portal',

      // Property-specific meta
      propertyType: property.property_type,
      propertyPrice: property.price,
      propertyLocation: `${property.location}, ${property.city}`,
      propertyArea: property.area,
      propertyBedrooms: property.bedrooms,
      propertyStatus: property.status
    };

    res.json({
      success: true,
      data: metaTags
    });
  } catch (error) {
    console.error('Error generating meta tags:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
