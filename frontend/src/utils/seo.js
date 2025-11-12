/**
 * SEO Utility Functions
 * Helper functions for SEO optimization
 */

/**
 * Generate SEO-friendly URL slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} - SEO-friendly slug
 */
export const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end
};

/**
 * Generate property URL with SEO-friendly slug
 * @param {object} property - Property object
 * @returns {string} - SEO-friendly property URL
 */
export const generatePropertyUrl = (property) => {
  const slug = generateSlug(
    `${property.bedrooms ? property.bedrooms + '-bhk-' : ''}${property.property_type}-for-${property.listing_type}-in-${property.location}-${property.city}`
  );
  return `/properties/${property.id}/${slug}`;
};

/**
 * Generate meta description from property
 * @param {object} property - Property object
 * @param {number} maxLength - Maximum length (default: 160)
 * @returns {string} - Meta description
 */
export const generateMetaDescription = (property, maxLength = 160) => {
  const priceFormatted = property.price >= 10000000
    ? `₹${(property.price / 10000000).toFixed(2)} Cr`
    : `₹${(property.price / 100000).toFixed(2)} Lakhs`;

  let description = `${property.bedrooms ? property.bedrooms + ' BHK ' : ''}${property.property_type?.replace('_', ' ')} for ${property.listing_type} in ${property.location}, ${property.city}. ${priceFormatted}. `;

  if (property.area) {
    description += `${property.area} sqft. `;
  }

  if (property.description) {
    const remainingLength = maxLength - description.length - 3; // -3 for "..."
    if (remainingLength > 0) {
      description += property.description.substring(0, remainingLength) + '...';
    }
  }

  return description.substring(0, maxLength);
};

/**
 * Generate keywords from property
 * @param {object} property - Property object
 * @returns {string} - Comma-separated keywords
 */
export const generateKeywords = (property) => {
  const keywords = [
    property.property_type?.replace('_', ' '),
    property.listing_type,
    property.location,
    property.city,
    property.region,
    property.bedrooms ? `${property.bedrooms} BHK` : '',
    property.bedrooms ? `${property.bedrooms} bedroom` : '',
    property.furnishing_status,
    'real estate',
    'property',
    property.listing_type === 'sale' ? 'buy property' : 'rent property',
    property.listing_type === 'sale' ? 'property for sale' : 'property for rent',
    'apartments',
    'houses',
    'villas'
  ];

  // Add amenities as keywords
  if (property.amenities && Array.isArray(property.amenities)) {
    keywords.push(...property.amenities.slice(0, 5));
  }

  return keywords.filter(Boolean).join(', ');
};

/**
 * Generate page title with site name
 * @param {string} title - Page title
 * @param {string} siteName - Site name (default: 'Real Estate Portal')
 * @returns {string} - Complete page title
 */
export const generatePageTitle = (title, siteName = 'Real Estate Portal') => {
  return title ? `${title} | ${siteName}` : siteName;
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format price for display in meta tags
 * @param {number} price - Price in rupees
 * @returns {string} - Formatted price string
 */
export const formatPriceForSEO = (price) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Crore`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lakh`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

/**
 * Generate breadcrumb schema for SEO
 * @param {array} breadcrumbs - Array of breadcrumb items [{name, url}]
 * @returns {object} - Breadcrumb structured data
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

/**
 * Generate FAQ schema for SEO
 * @param {array} faqs - Array of FAQ items [{question, answer}]
 * @returns {object} - FAQ structured data
 */
export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Generate review schema for property
 * @param {array} reviews - Array of review objects
 * @returns {object} - Review aggregate structured data
 */
export const generateReviewSchema = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "ratingValue": averageRating.toFixed(1),
    "reviewCount": reviews.length,
    "bestRating": "5",
    "worstRating": "1"
  };
};

/**
 * Check if content is SEO-friendly
 * @param {object} content - Content to check {title, description}
 * @returns {object} - SEO score and recommendations
 */
export const checkSEOQuality = (content) => {
  const issues = [];
  let score = 100;

  // Title checks
  if (!content.title) {
    issues.push('Title is missing');
    score -= 30;
  } else {
    if (content.title.length < 30) {
      issues.push('Title is too short (recommended: 30-60 characters)');
      score -= 10;
    } else if (content.title.length > 60) {
      issues.push('Title is too long (recommended: 30-60 characters)');
      score -= 10;
    }
  }

  // Description checks
  if (!content.description) {
    issues.push('Description is missing');
    score -= 30;
  } else {
    if (content.description.length < 120) {
      issues.push('Description is too short (recommended: 120-160 characters)');
      score -= 10;
    } else if (content.description.length > 160) {
      issues.push('Description is too long (recommended: 120-160 characters)');
      score -= 5;
    }
  }

  // Image checks
  if (!content.image) {
    issues.push('No featured image');
    score -= 15;
  }

  // Keywords checks
  if (!content.keywords || content.keywords.length === 0) {
    issues.push('No keywords specified');
    score -= 15;
  }

  return {
    score: Math.max(0, score),
    issues,
    isGood: score >= 80,
    rating: score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Poor'
  };
};

/**
 * Extract location keywords for local SEO
 * @param {string} city - City name
 * @param {string} location - Location/area name
 * @returns {array} - Array of location keywords
 */
export const generateLocalSEOKeywords = (city, location) => {
  const keywords = [];

  if (city) {
    keywords.push(
      `properties in ${city}`,
      `real estate ${city}`,
      `buy property ${city}`,
      `rent property ${city}`,
      `${city} real estate`
    );
  }

  if (location) {
    keywords.push(
      `properties in ${location}`,
      `${location} properties`,
      `real estate ${location}`
    );
  }

  if (city && location) {
    keywords.push(
      `properties in ${location} ${city}`,
      `${location} ${city} real estate`
    );
  }

  return keywords;
};

/**
 * Generate social sharing URLs
 * @param {string} url - URL to share
 * @param {string} title - Title of content
 * @returns {object} - Social sharing URLs
 */
export const generateSocialShareUrls = (url, title) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
  };
};

export default {
  generateSlug,
  generatePropertyUrl,
  generateMetaDescription,
  generateKeywords,
  generatePageTitle,
  truncateText,
  formatPriceForSEO,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateReviewSchema,
  checkSEOQuality,
  generateLocalSEOKeywords,
  generateSocialShareUrls
};
