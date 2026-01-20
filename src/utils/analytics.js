export const trackEvent = (action, category, label, value = null) => {
  // Log for debugging (helps verify events are triggering)
  console.log(`[Analytics] Event: ${action}`, { category, label, value });

  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  } else {
    console.warn('[Analytics] GA4 not loaded or blocked');
  }
};
