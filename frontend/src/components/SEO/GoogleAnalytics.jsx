import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Google Analytics Integration Component
 * Tracks pageviews and events
 */
const GoogleAnalytics = () => {
  const location = useLocation();
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

  useEffect(() => {
    // Load Google Analytics script
    if (!window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false, // We'll manually send page views
        anonymize_ip: true
      });
    }
  }, []);

  useEffect(() => {
    // Track page view on route change
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title
      });

      // Send explicit pageview event
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title
      });
    }
  }, [location]);

  return null; // This component doesn't render anything
};

/**
 * Track custom events in Google Analytics
 * @param {string} eventName - Event name
 * @param {object} eventParams - Event parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Track property view event
 * @param {string} propertyId - Property ID
 * @param {string} propertyTitle - Property title
 */
export const trackPropertyView = (propertyId, propertyTitle) => {
  trackEvent('view_property', {
    property_id: propertyId,
    property_title: propertyTitle
  });
};

/**
 * Track contact property owner event
 * @param {string} propertyId - Property ID
 * @param {string} contactType - Type of contact (phone, email, whatsapp)
 */
export const trackContactProperty = (propertyId, contactType) => {
  trackEvent('contact_property', {
    property_id: propertyId,
    contact_type: contactType
  });
};

/**
 * Track property shortlist event
 * @param {string} propertyId - Property ID
 */
export const trackShortlistProperty = (propertyId) => {
  trackEvent('shortlist_property', {
    property_id: propertyId
  });
};

/**
 * Track search event
 * @param {string} searchTerm - Search term
 * @param {number} resultsCount - Number of results
 */
export const trackSearch = (searchTerm, resultsCount) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount
  });
};

/**
 * Track property listing submission
 * @param {string} propertyType - Property type
 * @param {string} listingType - Listing type (sale/rent)
 */
export const trackPropertySubmission = (propertyType, listingType) => {
  trackEvent('submit_property', {
    property_type: propertyType,
    listing_type: listingType
  });
};

/**
 * Track virtual tour view
 * @param {string} propertyId - Property ID
 */
export const trackVirtualTourView = (propertyId) => {
  trackEvent('view_virtual_tour', {
    property_id: propertyId
  });
};

/**
 * Track video call tour request
 * @param {string} propertyId - Property ID
 */
export const trackVideoCallRequest = (propertyId) => {
  trackEvent('request_video_call', {
    property_id: propertyId
  });
};

/**
 * Track home loan application
 * @param {string} bankName - Bank name
 * @param {number} loanAmount - Loan amount
 */
export const trackLoanApplication = (bankName, loanAmount) => {
  trackEvent('apply_home_loan', {
    bank_name: bankName,
    loan_amount: loanAmount
  });
};

export default GoogleAnalytics;
