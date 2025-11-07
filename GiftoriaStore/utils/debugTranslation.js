// Debug utility to catch objects being rendered as React children
export const debugRender = (value, componentName = 'Unknown') => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const keys = Object.keys(value);
    if (keys.includes('en') && keys.includes('ar')) {
      console.error(`🚨 FOUND THE ISSUE! Component: ${componentName}`);
      console.error(`Object with {en, ar} keys being rendered:`, value);
      console.trace('Stack trace:');
      // Return a safe string instead of the object
      return `[DEBUG: Object with en/ar keys in ${componentName}]`;
    }
  }
  return value;
};

// Wrapper for translation function to catch issues
export const safeT = (t, key, componentName = 'Unknown') => {
  try {
    const result = t(key);
    return debugRender(result, `${componentName}-${key}`);
  } catch (error) {
    console.error(`Translation error in ${componentName} for key ${key}:`, error);
    return key; // Return the key as fallback
  }
};