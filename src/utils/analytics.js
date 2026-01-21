// Centralized Analytics utility for Google Analytics 4 (GA4)
// Allows specific event tracking to measure user engagement and ROI of the portfolio

export const trackEvent = (action, category, label, value = null) => {
  // Developer Debug: Log events in console to verify triggering before deployment
  // Useful when testing in 'localhost' or checking if AdBlockers are interfering
  console.log(`[Analytics] Event: ${action}`, { category, label, value });

  // Check if the 'gtag' function is available (loaded via index.html script)
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  } else {
    // Fallback or warning if GA4 script failed to load (e.g. adblocker)
    console.warn('[Analytics] GA4 not loaded or blocked - Event not sent');
  }
};
