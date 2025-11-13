import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * SEO Head Component
 * Manages all meta tags, Open Graph, Twitter Cards, and structured data
 */
const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'Real Estate Portal',
  publishedTime,
  modifiedTime,
  structuredData,
  canonical,
  noindex = false
}) => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://yourdomain.com';
  const siteName = 'Real Estate Portal';

  // Default values
  const defaultTitle = 'Real Estate Portal - Buy, Sell & Rent Properties';
  const defaultDescription = 'Find your dream property. Browse thousands of properties for sale and rent. Apartments, Houses, Villas, Plots and more in Coimbatore, Salem, Tirupur.';
  const defaultImage = `${baseUrl}/og-image.jpg`;
  const defaultKeywords = 'real estate, property, buy property, sell property, rent property, apartments, houses, villas, plots, Coimbatore, Salem, Tirupur';

  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url || baseUrl;
  const pageKeywords = keywords || defaultKeywords;
  const canonicalUrl = canonical || pageUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={author} />

      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:site" content="@YourTwitterHandle" />
      <meta name="twitter:creator" content="@YourTwitterHandle" />

      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#1890ff" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Organization Schema - Always include */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "sameAs": [
            "https://www.facebook.com/yourpage",
            "https://twitter.com/yourhandle",
            "https://www.linkedin.com/company/yourcompany",
            "https://www.instagram.com/yourhandle"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-XXXXXXXXXX",
            "contactType": "Customer Service",
            "areaServed": "IN",
            "availableLanguage": ["English", "Tamil"]
          }
        })}
      </script>
    </Helmet>
  );
};

SEOHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  author: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  structuredData: PropTypes.object,
  canonical: PropTypes.string,
  noindex: PropTypes.bool
};

export default SEOHead;
